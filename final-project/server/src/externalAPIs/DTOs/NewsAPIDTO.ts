interface NewsData {
  category?: string;
  content?: string;
  description?: string;
  id?: string;
  imageUrl?: string;
  keywords?: string[];
  publishedAt?: Date | string;
  title?: string;
  url?: string;
}

export class NewsDTO {
  category?: string;
  content: string;
  description: string;
  id: number;
  imageUrl: string;
  keywords: string[];
  publishedAt: Date;
  source: string;
  title: string;
  url: string;

  constructor(data: NewsData, source: string) {
    this.source = source;

    this.id = data.id ? parseInt(data.id) : 0;
    this.title = data.title ?? "";
    this.description = data.description ?? "";
    this.content = data.content ?? "";
    this.url = data.url ?? "";
    this.imageUrl = data.imageUrl ?? "";
    this.publishedAt = data.publishedAt ? new Date(data.publishedAt) : new Date();
    this.keywords = data.keywords ?? [];
    this.category = data.category;
  }
}
