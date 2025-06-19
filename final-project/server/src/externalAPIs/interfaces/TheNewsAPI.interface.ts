export interface TheNewsAPIResponse {
  data: TheNewsArticle[];
}

export interface TheNewsArticle {
  content: string;
  description: string;
  image_url: string;
  published_at: string;
  title: string;
  url: string;
}
