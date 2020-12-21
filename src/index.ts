import os from "os";
import cluster from "cluster";
import "reflect-metadata";
import app from "./services/server";
import connect from "./helpers/db";
import config from "./helpers/config";
import logger from "./services/logger";

const start = async (): Promise<void> => {
	try {
		await connect();
	} catch (e) {
		throw new Error(e);
	}
	app.listen(config.PORT, () => {
		logger.info(`http://localhost:${config.PORT}`);
	});
};

if (cluster.isMaster && config.NODE_ENV === "production") {
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