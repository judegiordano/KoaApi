import { ConnectionOptions } from "typeorm";
import config from "./config";
import { Environment } from "../types/Constants";

export default {
	type: config.DB_TYPE,
	host: config.DB_HOST,
	port: config.DB_PORT,
	username: config.DB_USERNAME,
	password: config.DB_PASSWORD,
	database: config.DB_NAME,
	synchronize: false,
	logging: config.NODE_ENV == Environment.dev ? true : false,
	autoReconnect: true,
	reconnectTries: Number.MAX_VALUE,
	reconnectInterval: 2000,
	entities: [
		`${config.IS_COMPILED ? "build" : "src"}/models/**/*.${config.IS_COMPILED ? "js" : "ts"}`
	]
} as ConnectionOptions;