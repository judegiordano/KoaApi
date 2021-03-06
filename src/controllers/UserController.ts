import koa, { Next } from "koa";
import Router from "koa-router";
import { IDeleteAccount, ILogin, IRegister, IUpdateEmail, IUpdatePass } from "../types/IUserActions";
import { signUser } from "../helpers/jwt";
import { IJwtPayload } from "../types/IJWT";
import { RequestErrors } from "../types/Constants";
import { CacheNames } from "../types/Constants";
import cache from "../services/cache";
import jwt from "../middleware/jwt";
import user from "../repositories/UserRepository";

const router = new Router({ prefix: "/user" });

router.post("/login", async (ctx: koa.Context, next: koa.Next): Promise<Next> => {

	const req = <ILogin>ctx.request.body;
	if (!req.email || !req.password) throw Error(RequestErrors.missingBody);

	try {
		const query: IJwtPayload = await user.Login(req);
		ctx.body = { token: await signUser(query) as string };
		return await next();
	} catch (e) {
		throw Error(e);
	}
});

router.post("/register", async (ctx: koa.Context, next: koa.Next): Promise<Next> => {

	const req = <IRegister>ctx.request.body;
	if (!req.email || !req.password) throw Error(RequestErrors.missingBody);

	try {
		const query: IJwtPayload = await user.Register(req);
		ctx.body = { token: await signUser(query) as string };
		return await next();
	} catch (e) {
		throw Error(e);
	}
});

router.post("/validate", jwt, async (ctx: koa.Context, next: koa.Next): Promise<Next> => {
	try {
		ctx.body = ctx.state.jwt;
		return await next();
	} catch (e) {
		throw Error(e);
	}
});

router.post("/update/email", jwt, async (ctx: koa.Context, next: koa.Next): Promise<Next> => {

	const req = <IUpdateEmail>ctx.request.body;
	if (!req.newEmail) throw Error(RequestErrors.missingEmail);

	try {
		const query = await user.UpdateEmail({
			id: ctx.state.jwt.id,
			email: ctx.state.jwt.email,
			newEmail: req.newEmail
		});

		ctx.body = { token: await signUser(query) as string };
		return await next();
	} catch (e) {
		throw Error(e);
	}
});

router.post("/update/password", jwt, async (ctx: koa.Context, next: koa.Next): Promise<Next> => {

	const req = <IUpdatePass>ctx.request.body;
	if (!req.newPassword) throw Error(RequestErrors.missingPassword);

	try {
		const query = await user.UpdatePassword({
			id: ctx.state.jwt.id,
			email: ctx.state.jwt.email,
			newPassword: req.newPassword
		});

		ctx.body = { token: await signUser(query) };
		return await next();
	} catch (e) {
		throw Error(e);
	}
});

router.post("/delete", jwt, async (ctx: koa.Context, next: koa.Next): Promise<Next> => {

	const req = <IDeleteAccount>ctx.request.body;
	if (!req.password || !req.email) throw Error(RequestErrors.missingBody);

	try {
		await user.DeleteUser({
			id: ctx.state.jwt.id,
			email: req.email,
			password: req.password
		});

		ctx.body = {
			ok: true,
			status: ctx.status,
			message: "account deleted"
		};
		return await next();
	} catch (e) {
		throw Error(e);
	}
});

router.get("/id/:id", async (ctx: koa.Context, next: koa.Next): Promise<Next> => {

	const req: number = ctx.params.id;

	try {
		const cachedUser = cache.get(`${CacheNames.getById}${req}`);
		if (cachedUser != undefined) {
			ctx.body = cachedUser;
			return await next();
		}

		const query = await user.GetOne(req);
		cache.set(`${CacheNames.getById}${req}`, query, 60 * 15);

		ctx.body = query;
		return await next();
	} catch (e) {
		throw Error(e);
	}
});

export default router;