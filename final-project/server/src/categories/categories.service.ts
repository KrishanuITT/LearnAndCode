import { CategoriesRepository } from "./categories.repository.js";

export class CategoriesService {
  constructor(private repo: CategoriesRepository) {}

  add(name: string) {
    return this.repo.insert(name);
  }

  async findByName(name: string){
    return this.repo.findByName(name);
  }

  getAll() {
    return this.repo.findAll();
  }
  
}
