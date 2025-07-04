import { SavedArticlesRepository } from "./savedArticles.repository.js";

export class SavedArticlesService {
  constructor(private repo: SavedArticlesRepository) {}

  delete(userId: number, newsId: number) {
    return this.repo.deleteArticle(userId, newsId);
  }

  getAll(userId: number) {
    return this.repo.getSavedArticles(userId);
  }

  async likeOrDislike(userId: number, newsId: number, isLike: boolean) {
    await this.repo.upsertLike(userId, newsId, isLike);
  }

  save(userId: number, newsId: number) {
    return this.repo.saveArticle(userId, newsId);
  }
}
