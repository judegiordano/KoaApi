import Router from "koa-router";
import { ILogin, IRegister } from "../types/IUserActions";
import { sign } from "../helpers/jwt";
import { IJwtPayload } from "../types/IJWT";
import jwt from "../middleware/jwt";
import user from "../repositories/UserRepository";

const router = new Router({ prefix: "/user" });

router.post("/login", async (ctx, next) => {
	const req = <ILogin>ctx.request.body;
	if (!req.email || !req.password) {
		throw Error("missing body { email, password }");
	}

	try {
		const query = await user.Login({
			email: req.email,
			password: req.password
		} as ILogin);

		const _token = await sign({
			id: query.id,
			email: query.email,
			created: query.created,
			activated: query.activated
		} as IJwtPayload);

		ctx.status = 200;
		ctx.body = { token: _token };
		await next();
	} catch (e) {
		throw Error(e);
	}
});

router.post("/register", async (ctx, next) => {
	const req = <IRegister>ctx.request.body;
	if (!req.email || !req.password) {
		throw Error("missing body { email, password }");
	}

	try {
		const query = await user.Register({
			email: req.email,
			password: req.password
		} as IRegister);

		const _token = await sign({
			id: query.id,
			email: query.email,
			created: query.created,
			activated: query.activated
		} as IJwtPayload);

		ctx.status = 200;
		ctx.body = { token: _token };
		await next();
	} catch (e) {
		throw Error(e);
	}
});

router.post("/validate", jwt, async (ctx, next) => {
	ctx.body = ctx.state.jwt;
	await next();
});

router.get("/:id", async (ctx, next) => {
	const req: number = ctx.params.id;
	try {
		const query = await user.GetOne(req);
		ctx.status = 200;
		ctx.body = query;
		await next();
	} catch (e) {
		throw Error(e);
	}
});

export default router;