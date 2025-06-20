import { NewsDTO } from "#externalAPIs/DTOs/NewsAPIDTO.js";

export interface NewsProvider {
  fetchNews(): Promise<NewsDTO[]>;
  getName(): string;
}
