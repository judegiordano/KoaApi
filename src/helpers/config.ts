import dotenv from "dotenv";
import path from "path";
dotenv.config();

export default {
	DB_TYPE: process.env.DB_TYPE || "mssql",
	PORT: parseInt(process.env.PORT) || 3000,
	DB_HOST: process.env.DB_HOST || "localhost",
	DB_PORT: parseInt(process.env.DB_PORT) || 1433,
	DB_USERNAME: process.env.DB_USERNAME || "sa",
	DB_PASSWORD: process.env.DB_PASSWORD || "password",
	DB_NAME: process.env.DB_NAME || "tempdb",
	JWT_SECRET: process.env.JWT_SECRET || "",
	NODE_ENV: process.env.NODE_ENV || "development",
	IS_COMPILED: path.extname(__filename).includes("js")
};