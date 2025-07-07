import { ExternalAPIRepository } from "#externalAPIs/ExternalAPI.repository.js";
import { ExternalAPIService } from "#externalAPIs/ExternalAPI.service.js";
import { ExternalAPIManager } from "#externalAPIs/ExternalAPIManager.js";
import { NewsIngestionService } from "#notifications/mail.service.js";
import { NotificationRepository } from "#notifications/notifications.repository.js";
import { UserRepository } from "#user/User.repository.js";
import { Logger } from "#utils/Logger.js";
import cron from "node-cron";

const logger = new Logger();
const manager = new ExternalAPIManager();
const repository = new ExternalAPIRepository();
const service = new ExternalAPIService(manager, repository);
const notifRepo = new NotificationRepository();
const userRepo = new UserRepository();
const ingestionService = new NewsIngestionService(notifRepo, userRepo);

async function runNewsSyncJob() {
  const timestamp = new Date().toISOString();
  logger.log(`[${timestamp}] Running news sync job...`);

  try {
    const news = await service.fetchAllNews();
    await service.saveNewsToDatabase(news);
    logger.log("News fetched and saved to DB.");
    const latestArticles = await repository.getLatestArticles();
    await ingestionService.checkAndNotifyUsers(latestArticles);
    logger.log("User notifications dispatched successfully.");
  } catch (error) {
    logger.error(`Error during news sync: ${JSON.stringify(error)}`);
  }
}

cron.schedule("0 */3 * * *", runNewsSyncJob);
logger.log("Cron job scheduled: every 3 hours (0 */3 * * *)");
