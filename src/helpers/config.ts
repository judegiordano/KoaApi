import * as dotenv from "dotenv";
import path from "path";
import os from "os";
import { Environment } from "../types/Constants";
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
	NODE_ENV: <Environment>env,
	CORES: <number>cors,
	IS_COMPILED: <boolean>path.extname(__filename).includes("js"),
	LIMIT: <number>30,
	LIMIT_RESET: <number>(60000 * 10)  // 10 minutes
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
