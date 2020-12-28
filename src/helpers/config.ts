import * as dotenv from "dotenv";
import Koa from "koa";
import path from "path";
import os from "os";
import { Environment, RateLimit } from "../types/Constants";
import IRateLimitOptions from "../types/IRateLimitOptions";

dotenv.config();

let env;
let cors;
if (process.env.NODE_ENV === Environment.prod) {
	env = Environment.prod;
	cors = os.cpus().length;
}
else if (process.env.NODE_ENV === Environment.stg) {
	env = Environment.stg;
	cors = Math.ceil(os.cpus().length / 2);
}
else {
	env = Environment.dev;
	cors = 1;
}

const config = {
	PORT: <number>parseInt(process.env.PORT) || 3000,
	DB_TYPE: <string>process.env.DB_TYPE || undefined,
	DB_HOST: <string>process.env.DB_HOST || undefined,
	DB_PORT: <number>parseInt(process.env.DB_PORT) || 1433,
	DB_USERNAME: <string>process.env.DB_USERNAME || undefined,
	DB_PASSWORD: <string>process.env.DB_PASSWORD || undefined,
	DB_NAME: <string>process.env.DB_NAME || undefined,
	JWT_SECRET: <string>process.env.JWT_SECRET || undefined,
	JWT_EXPIRATION: <string | number>"7d",
	NODE_ENV: <Environment>env,
	CORES: <number>cors,
	IS_COMPILED: <boolean>path.extname(__filename).includes("js"),
	SLOW_DOWN: {
		windowMs: <number>30 * 60 * 1000, // 10 minutes
		delayAfter: <number>50,
		delayMs: <number>500
	},
	RATE_LIMIT: <IRateLimitOptions>{
		driver: "memory",
		db: new Map(),
		duration: (60000 * 30), // 30 minutes,
		errorMessage: RateLimit.error,
		id: (ctx: Koa.Context) => ctx.ip,
		headers: {
			remaining: "Rate-Limit-Remaining",
			reset: "Rate-Limit-Reset",
			total: "Rate-Limit-Total"
		},
		max: 100,
		disableHeader: false
	},
	CACHE_SETTINGS: {
		stdTTL: <number>100,
		checkperiod: <number>120
	}
};

if (config.DB_TYPE === undefined) {
	throw Error("DB_TYPE not specified");
}
else if (config.DB_HOST === undefined) {
	throw Error("DB_HOST not specified");
}
else if (config.DB_USERNAME === undefined) {
	throw Error("DB_USERNAME not specified");
}
else if (config.DB_PASSWORD === undefined) {
	throw Error("DB_PASSWORD not specified");
}
else if (config.DB_NAME === undefined) {
	throw Error("DB_NAME not specified");
}
else if (config.JWT_SECRET === undefined) {
	throw Error("JWT_SECRET must be set");
}

export default config;
