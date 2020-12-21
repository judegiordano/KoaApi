import { Connection, createConnection, getConnection } from "typeorm";
import logger from "../services/logger";
import ORMConfig from "./ormconfig";

const connect = async () => {
	let connection: Connection | undefined;
	try {
		connection = getConnection();
	} catch (e) {
		logger.error("ERROR: Database connection failed!!", e);
	}

	try {
		if (connection) {
			if (!connection.isConnected) {
				await connection.connect();
			}
		} else {
			await createConnection(ORMConfig);
		}
		logger.info("Database connection was successful!");
	} catch (e) {
		logger.error("ERROR: Database connection failed!!", e);
		throw new Error(e);
	}
};

export default connect;