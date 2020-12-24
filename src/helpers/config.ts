import dotenv from "dotenv";
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
	DB_TYPE: process.env.DB_TYPE || "mssql",
	PORT: parseInt(process.env.PORT) || 3000,
	DB_HOST: process.env.DB_HOST || "localhost",
	DB_PORT: parseInt(process.env.DB_PORT) || 1433,
	DB_USERNAME: process.env.DB_USERNAME || "sa",
	DB_PASSWORD: process.env.DB_PASSWORD || "password",
	DB_NAME: process.env.DB_NAME || "tempdb",
	JWT_SECRET: process.env.JWT_SECRET || undefined,
	NODE_ENV: env,
	CORES: parseInt(process.env.UV_THREADPOOL_SIZE) as number,
	IS_COMPILED: path.extname(__filename).includes("js")
};

if (config.JWT_SECRET === undefined) {
	throw Error("JWT_SECRET must be set");
}

export default config;
