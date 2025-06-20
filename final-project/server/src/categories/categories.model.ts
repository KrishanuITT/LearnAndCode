export class Category {
    createdAt: Date;
    id: number;
    name: string;
    updatedAt: Date;
  
    constructor(data: {
      created_at: Date;
      id: number;
      name: string;
      updated_at: Date;
    }) {
      this.id = data.id;
      this.name = data.name;
      this.createdAt = new Date(data.created_at);
      this.updatedAt = new Date(data.updated_at);
    }
  }
  