import { SavedArticlesRepository } from "./savedArticles.repository.js";

export class SavedArticlesService {
  constructor(private repository: SavedArticlesRepository) {}

  delete(userId: number, newsId: number) {
    return this.repository.deleteArticle(userId, newsId);
  }

  getAll(userId: number) {
    return this.repository.getSavedArticles(userId);
  }

  async likeOrDislike(userId: number, newsId: number, isLike: boolean) {
    await this.repository.upsertLike(userId, newsId, isLike);
  }

  save(userId: number, newsId: number) {
    return this.repository.saveArticle(userId, newsId);
  }
}
