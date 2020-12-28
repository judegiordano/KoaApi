import { Connection, createConnection, getConnection } from "typeorm";
import logger from "../services/logger";
import ORMConfig from "./ormconfig";
import { Database } from "../types/Constants";

const connect = async (): Promise<void> => {
	let connection: Connection | undefined;
	try {
		connection = getConnection();
	} catch (e) {
		logger.error(Database.connectionErr, e);
	}

	try {
		if (connection) {
			if (!connection.isConnected) {
				await connection.connect();
			}
		} else {
			await createConnection(ORMConfig);
		}
		logger.info(Database.connectionSucc);
	} catch (e) {
		logger.error(Database.connectionErr, e);
		throw Error(e);
	}
};

export default connect;