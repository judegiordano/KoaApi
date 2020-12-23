import { User } from "../models/User";
import { ILogin, IRegister } from "../types/IUserActions";
import { compare, hash } from "../helpers/password";

export default class UserRepository {

	public static async Login(login: ILogin): Promise<User> {
		try {
			const query = await User.findOne({
				email: login.email,
			});
			if (!query) throw Error("email not found");

			const hash = await compare(login.password, query.password);
			if (!hash) throw Error("wrong password");

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
			if (exists) throw Error("email taken");
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

	public static async GetOne(_id: number): Promise<User> {
		try {
			const query = await User.createQueryBuilder()
				.select("User")
				.where("User.id = :id", { id: _id }).getOne();

			if (!query) {
				throw Error(`user not found with id ${_id}`);
			}
			return query;
		} catch (e) {
			throw Error(e);
		}
	}
}