import { User } from "../models/User";
import { ILogin, IRegister } from "../types/IUserActions";
import { compare, hash } from "../helpers/password";
import { UserErrors } from "../types/Constants";

export default class UserRepository {

	// check credentials, return user or throw
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

	// check credentials, return new user or throw
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
			const tempPass = await hash(register.password);

			const newUser = new User();
			newUser.email = register.email;
			newUser.password = tempPass;
			newUser.activated = false;
			newUser.created = new Date;
			newUser.lastUpdated = new Date;

			return await newUser.save();
		} catch (e) {
			throw Error(e);
		}
	}

	// check id, return user or throw
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