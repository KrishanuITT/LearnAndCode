import { SearchRepository } from "./search.repository.js";

export class SearchService {
  constructor(private repository: SearchRepository) {}

  async search(query: string, start?: string, end?: string, sortBy?: "dislikes" | "likes") {
    return this.repository.searchArticles(query, start, end, sortBy);
  }
}
