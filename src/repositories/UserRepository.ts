import { User } from "../models/User";
import { IDeleteAccount, ILogin, IRegister, IUpdateEmail, IUpdatePass } from "../types/IUserActions";
import { compare, hash } from "../helpers/password";
import { UserErrors } from "../types/Constants";

export default class UserRepository {

	public static async Login(login: ILogin): Promise<User> {
		try {
			const query = await User.findOne({
				email: login.email,
			});
			if (!query) throw Error(UserErrors.emailNotFound);

			const hash = await compare(login.password, query.password);
			if (!hash) throw Error(UserErrors.wrongPassword);

			return query;
		} catch (e) {
			throw Error(e);
		}
	}

	public static async Register(register: IRegister): Promise<User> {
		try {
			const exists = await User.findOne({
				email: register.email,
			});
			if (exists) throw Error(UserErrors.emailTaken);
		} catch (e) {
			throw Error(e);
		}

		try {
			const hashedPass = await hash(register.password);

			const newUser = new User();
			newUser.email = register.email;
			newUser.password = hashedPass;
			newUser.activated = false;
			newUser.created = new Date;
			newUser.lastUpdated = new Date;

			return await newUser.save();
		} catch (e) {
			throw Error(e);
		}
	}

	public static async UpdateEmail(update: IUpdateEmail): Promise<User> {
		try {
			const exists = await User.findOne({
				where: {
					id: update.id,
					email: update.email
				}
			});
			if (!exists) throw Error(UserErrors.wrongCreds);

			const taken = await User.findOne({ email: update.newEmail });
			if (taken) throw Error(UserErrors.emailTaken);

			exists.email = update.newEmail;
			exists.lastUpdated = new Date;
			exists.save();

			return exists;
		} catch (e) {
			throw Error(e);
		}
	}

	public static async UpdatePassword(update: IUpdatePass): Promise<User> {
		try {
			const exists = await User.findOne({
				where: {
					id: update.id,
					email: update.email
				}
			});
			if (!exists) throw Error(UserErrors.wrongCreds);

			const hashedPass = await hash(update.newPassword);

			exists.password = hashedPass;
			exists.lastUpdated = new Date;
			exists.save();

			return exists;
		} catch (e) {
			throw Error(e);
		}
	}

	public static async DeleteUser(remove: IDeleteAccount): Promise<void> {
		try {
			const exists = await User.findOne({
				where: {
					id: remove.id,
					email: remove.email
				}
			});
			if (!exists) throw Error(UserErrors.wrongCreds);

			const hash = await compare(remove.password, exists.password);
			if (!hash) throw Error(UserErrors.wrongPassword);

			await User.delete(exists);

		} catch (e) {
			throw Error(e);
		}
	}

	public static async GetOne(_id: number): Promise<User> {
		try {
			const query = await User.createQueryBuilder()
				.select("User")
				.where("User.id = :id", { id: _id }).getOne();

			if (!query) {
				throw Error(UserErrors.wrongId);
			}
			return query;
		} catch (e) {
			throw Error(e);
		}
	}
}