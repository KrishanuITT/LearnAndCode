export interface NewsAPISourceResponse {
  sources: NewsAPISource[];
  status: string;
}

interface NewsAPISource {
  category: string;
  country: string;
  description: string;
  id: string;
  language: string;
  name: string;
  url: string;
}
