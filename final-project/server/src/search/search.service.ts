import { SearchRepository } from "./search.repository.js";

export class SearchService {
  constructor(private repo: SearchRepository) {}

  async search(query: string, start?: string, end?: string, sortBy?: "dislikes" | "likes") {
    return this.repo.searchArticles(query, start, end, sortBy);
  }
}
