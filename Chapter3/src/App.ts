import { UserInput } from './UserInput';
import { ApiService } from './APIService';
import { DataPresenter } from './DataPresenter';

export class TumblrApp {
  private inputService = new UserInput();
  private apiService = new ApiService();
  private presenter = new DataPresenter();

  async run(): Promise<void> {
    try {
      const userInput = await this.inputService.getUserInput();
      const apiUrl = this.apiService.buildApiUrl(userInput);
      console.log(`Fetching blogs from: ${apiUrl}`);

      const data = await this.apiService.fetchTumblrData(apiUrl);
      this.presenter.display(data);
    } catch (error) {
      console.error("Error:", (error as Error).message);
    }
  }
}
