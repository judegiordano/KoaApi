import koa, { Next } from "koa";
import Router from "koa-router";
import { ILogin, IRegister } from "../types/IUserActions";
import { signUser } from "../helpers/jwt";
import { IJwtPayload } from "../types/IJWT";
import { RequestErrors } from "../types/Constants";
import { CacheNames } from "../types/Constants";
import cache from "../services/cache";
import jwt from "../middleware/jwt";
import user from "../repositories/UserRepository";

const router = new Router({ prefix: "/user" });

// try logging user in and sign as jwt
router.post("/login", async (ctx: koa.Context, next: koa.Next): Promise<Next> => {
	const req = <ILogin>ctx.request.body;

	if (!req.email || !req.password) throw Error(RequestErrors.missingBody);


	try {
		const query: IJwtPayload = await user.Login(req);
		const _token: string = await signUser(query);

		ctx.status = 200;
		ctx.body = { token: _token };
		return await next();
	} catch (e) {
		throw Error(e);
	}
});

// try registering new user and sign as jwt
router.post("/register", async (ctx: koa.Context, next: koa.Next): Promise<Next> => {
	const req = <IRegister>ctx.request.body;

	if (!req.email || !req.password) throw Error(RequestErrors.missingBody);

	try {
		const query: IJwtPayload = await user.Register(req);
		const _token: string = await signUser(query);

		ctx.status = 200;
		ctx.body = { token: _token };
		return await next();
	} catch (e) {
		throw Error(e);
	}
});

// valiadte jwt middleware with Bearer token
router.post("/validate", jwt, async (ctx: koa.Context, next: koa.Next): Promise<Next> => {
	try {
		const token = ctx.state.jwt;
		ctx.status = 200;
		ctx.body = token;
		return await next();
	} catch (e) {
		throw Error(e);
	}
});

// get one user by id, if not cached, cache and return
router.get("/id/:id", async (ctx: koa.Context, next: koa.Next): Promise<Next> => {
	const req: number = ctx.params.id;

	try {
		const cachedUser = cache.get(`${CacheNames.getById}${req}`);
		if (cachedUser != undefined) {
			ctx.status = 200;
			ctx.body = cachedUser;
			return await next();
		}

		const query = await user.GetOne(req);
		cache.set(`${CacheNames.getById}${req}`, query, 60 * 15);

		ctx.status = 200;
		ctx.body = query;
		return await next();
	} catch (e) {
		throw Error(e);
	}
});

export default router;