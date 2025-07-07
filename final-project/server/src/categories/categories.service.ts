import { CategoriesRepository } from "./categories.repository.js";

export class CategoriesService {
  constructor(private repository: CategoriesRepository) {}

  add(name: string) {
    return this.repository.insert(name);
  }

  async findByName(name: string){
    return this.repository.findByName(name);
  }

  getAll() {
    return this.repository.findAll();
  }
  
}
