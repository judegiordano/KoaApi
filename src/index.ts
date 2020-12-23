import os from "os";
import cluster from "cluster";
import "reflect-metadata";
import app from "./services/server";
import connect from "./helpers/db";
import config from "./helpers/config";
import logger from "./services/logger";
import { Environment } from "./types/Constants";

const start = async (): Promise<void> => {
	try {
		await connect();
	} catch (e) {
		throw Error(e);
	}
	app.listen(config.PORT, () => {
		logger.info(`http://localhost:${config.PORT}`);
	});
};

if (cluster.isMaster && config.NODE_ENV === Environment.prod) {
	const cpus = os.cpus().length;
	logger.info(`${cpus} slave clusters created`);
	for (let i = 0; i < cpus; i++) {
		cluster.fork();
	}
} else if (cluster.isMaster) {
	start();
} else {
	start();
}