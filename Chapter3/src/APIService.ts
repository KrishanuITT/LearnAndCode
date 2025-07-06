import { IUserInput, ITumblrData } from './Interfaces';

const TUMBLR_API_URL_TEMPLATE = "https://<blogName>.tumblr.com/api/read/json?type=photo&num=";

export class ApiService {
  buildApiUrl({ blogName, startPost, endPost }: IUserInput): string {
    const count = endPost - startPost + 1;
    const offset = startPost - 1;
    return TUMBLR_API_URL_TEMPLATE.replace("<blogName>", blogName) + `${count}&start=${offset}`;
  }

  async fetchTumblrData(apiUrl: string): Promise<ITumblrData | null> {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const rawText = await response.text();
      const cleanedJson = rawText.replace("var tumblr_api_read = ", "").trim().slice(0, -1);
      return JSON.parse(cleanedJson);
    } catch (error) {
      console.error("Error fetching Tumblr data:", (error as Error).message);
      return null;
    }
  }
}
