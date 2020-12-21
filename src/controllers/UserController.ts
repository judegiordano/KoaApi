import Router from "koa-router";
import { ILogin, IRegister } from "../types/IUserActions";
import user from "../repositories/UserRepository";

const router = new Router({ prefix: "/user" });

router.post("/login", async (ctx, next) => {
	const req = <ILogin>ctx.request.body;
	if (!req.email || !req.password) {
		throw new Error("missing body { email, password }");
	}

	try {
		const query = await user.Login({
			email: req.email,
			password: req.password
		} as ILogin);

		ctx.status = 200;
		ctx.body = query;
		await next();
	} catch (e) {
		throw new Error(e);
	}
});

router.post("/register", async (ctx, next) => {
	const req = <IRegister>ctx.request.body;
	if (!req.email || !req.password) {
		throw new Error("missing body { email, password }");
	}

	try {
		const query = await user.Register({
			email: req.email,
			password: req.password
		} as IRegister);

		ctx.status = 200;
		ctx.body = { query };
		await next();
	} catch (e) {
		throw new Error(e);
	}
});

export default router;