import Koa from "koa";
import logger from "koa-logger";
import bodyParser from "koa-bodyparser";
import ratelimit from "koa-ratelimit";
import json from "koa-json";
import cors from "koa-cors";
import slowDown from "koa-slow-down";
import helmet from "koa-helmet";

import log from "./logger";
import router from "../controllers";
import { IErr } from "../types/IRoute";
import config from "../helpers/config";
import { Environment } from "../types/Constants";

const app = new Koa();

app.use(async (ctx: Koa.Context, next: Koa.Next) => {
	try {
		await next();
	} catch (e) {
		log.error(e.message);
		ctx.status = 500;
		ctx.body = {
			ok: false,
			status: ctx.status,
			error: e.message,
			raw: e.toString()
		} as IErr;
	}
});
if (config.NODE_ENV === Environment.prod) {
	app.use(ratelimit({
		driver: "memory",
		db: new Map(),
		duration: (60000 * 10), // 10 minutes
		errorMessage: "Too Many Requests. Please Try Again later.",
		id: (ctx) => ctx.ip,
		headers: {
			remaining: "Rate-Limit-Remaining",
			reset: "Rate-Limit-Reset",
			total: "Rate-Limit-Total"
		},
		max: 30,
		disableHeader: false
	}));
	app.use(slowDown(config.SLOW_DOWN));
}
if (config.NODE_ENV === Environment.dev) {
	app.use(logger());
}
app.use(cors());
app.use(json());
app.use(helmet());
app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

export default app;