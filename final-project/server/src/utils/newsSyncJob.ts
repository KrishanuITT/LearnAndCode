import { ExternalAPIRepository } from "#externalAPIs/ExternalAPI.repository.js";
import { ExternalAPIService } from "#externalAPIs/ExternalAPI.service.js";
import { ExternalAPIManager } from "#externalAPIs/ExternalAPIManager.js";
import cron from "node-cron";

import { Logger } from "./Logger.js";

const manager = new ExternalAPIManager();
const repository = new ExternalAPIRepository();
const service = new ExternalAPIService(manager, repository);
const logger = new Logger();

cron.schedule("0 */3 * * *", async () => {
  logger.log(`[${new Date().toISOString()}] Running news sync job...`);
  try {
    const news = await service.fetchAllNews();
    await service.saveNewsToDatabase(news);
    logger.log("News synced successfully.");
  } catch (error) {
    logger.error(`Error syncing news: ${JSON.stringify(error)}`);
  }
});
