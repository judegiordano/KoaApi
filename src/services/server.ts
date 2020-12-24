import Koa from "koa";
import logger from "koa-logger";
import bodyParser from "koa-bodyparser";
import ratelimit from "koa-ratelimit";
import json from "koa-json";
import cors from "koa-cors";
import helmet from "koa-helmet";

import log from "./logger";
import router from "../controllers";
import { IErr } from "../types/IRoute";
import { RateLimit } from "../types/Constants";
import config from "../helpers/config";
import { Environment } from "../types/Constants";

const app = new Koa();
const map = new Map();
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
		db: map,
		duration: config.LIMIT_RESET,
		errorMessage: RateLimit.error,
		id: (ctx) => ctx.ip,
		headers: {
			remaining: "Rate-Limit-Remaining",
			reset: "Rate-Limit-Reset",
			total: "Rate-Limit-Total"
		},
		max: config.LIMIT,
		disableHeader: false
	}));
}
app.use(cors());
app.use(json());
app.use(logger());
app.use(helmet());
app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

export default app;