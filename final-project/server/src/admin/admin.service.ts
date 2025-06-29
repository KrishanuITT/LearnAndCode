import { AdminRepository } from "./admin.repository.js";

export class AdminService {
  constructor(private repository: AdminRepository) {}
  addKeywords(keyword: string): Promise<void> {
    return this.repository.addKeyword(keyword);
  }

  getAllKeywords() {
    return this.repository.getAllKeywords();
  }

  removeKeywords(keyword: string): Promise<void> {
    return this.repository.deleteKeyword(keyword);
  }

  updateQueryStatus(hide: boolean, categoryId: number) {
    return this.repository.updateQueryStatus(hide, categoryId);
  }
}
