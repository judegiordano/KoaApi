import * as dotenv from "dotenv";
import path from "path";
import os from "os";
import { Environment } from "../types/Constants";
dotenv.config();

let env;
const cpus = os.cpus().length;

if (process.env.NODE_ENV === Environment.stg) {
	env = Environment.stg;
	process.env.UV_THREADPOOL_SIZE = (cpus / 2).toString();
}
else if (process.env.NODE_ENV === Environment.prod) {
	env = Environment.prod;
	process.env.UV_THREADPOOL_SIZE = cpus.toString();
}
else {
	env = Environment.dev;
	process.env.UV_THREADPOOL_SIZE = "1";
}

const config = {
	PORT: parseInt(process.env.PORT) || 3000,
	DB_TYPE: process.env.DB_TYPE || undefined,
	DB_HOST: process.env.DB_HOST || undefined,
	DB_PORT: parseInt(process.env.DB_PORT) || 1433,
	DB_USERNAME: process.env.DB_USERNAME || undefined,
	DB_PASSWORD: process.env.DB_PASSWORD || undefined,
	DB_NAME: process.env.DB_NAME || undefined,
	JWT_SECRET: process.env.JWT_SECRET || undefined,
	NODE_ENV: env,
	CORES: <number>parseInt(process.env.UV_THREADPOOL_SIZE),
	IS_COMPILED: path.extname(__filename).includes("js"),
	LIMIT: 30,
	LIMIT_RESET: (60000 * 10)  // 10 minutes
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
