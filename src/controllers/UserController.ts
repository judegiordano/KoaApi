import Router from "koa-router";
import { ILogin, IRegister } from "../types/IUserActions";
import { signUser } from "../helpers/jwt";
import { IJwtPayload } from "../types/IJWT";
import { RequestErrors } from "../types/Constants";
import jwt from "../middleware/jwt";
import user from "../repositories/UserRepository";

const router = new Router({ prefix: "/user" });

router.post("/login", async (ctx, next) => {
	const req = <ILogin>ctx.request.body;
	if (!req.email || !req.password) {
		throw Error(RequestErrors.missingBody);
	}

	try {
		const query: IJwtPayload = await user.Login(req);
		const _token: string = await signUser(query);

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
		throw Error(RequestErrors.missingBody);
	}

	try {
		const query: IJwtPayload = await user.Register(req);
		const _token: string = await signUser(query);

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