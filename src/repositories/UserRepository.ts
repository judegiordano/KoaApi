import { User } from "../models/User";
import { ILogin, IRegister } from "../types/IUserActions";
import { compare, hash } from "../helpers/password";

export default class UserRepository {

	public static async Login(login: ILogin): Promise<User> {
		try {
			const query = await User.findOne({
				email: login.email,
			});
			if (!query) throw new Error("email not found");

			const hash = await compare(login.password, query.password);
			if (!hash) throw new Error("wrong password");

			return query;
		} catch (e) {
			throw new Error(e);
		}
	}

	public static async Register(register: IRegister): Promise<User> {
		try {
			const exists = await User.findOne({
				email: register.email,
			});
			if (exists) throw new Error("email taken");
		} catch (e) {
			throw new Error(e);
		}

		try {
			const tempPass = await hash(register.password);

			const newUser = new User();
			newUser.email = register.email;
			newUser.password = tempPass;

			return await newUser.save();
		} catch (e) {
			throw new Error(e);
		}
	}
}