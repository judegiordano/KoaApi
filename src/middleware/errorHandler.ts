import Koa from "koa";
import { IErr } from "../types/IRoute";
import log from "../services/logger";

export default async (ctx: Koa.Context, next: Koa.Next) => {
	try {
		await next();
	} catch (e) {
		log.error(e.message);
		ctx.status = 500;
		ctx.body = {
			ok: false,
			status: ctx.status,
			error: e.message,
			raw: e.stack.toString()
		} as IErr;
	}
};