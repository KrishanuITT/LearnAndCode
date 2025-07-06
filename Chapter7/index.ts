import dotenv from "dotenv";
import { Prompt } from "./utils/prompts";
import { LocationService } from "./LocationService";
import { LocationDTO } from "./dto/LocationDTO";
import { MissingApiKeyError } from "./utils/Errors";

dotenv.config({ path: ".env" });

class App {
  private prompt: Prompt;
  private locationService: LocationService;

  constructor() {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new MissingApiKeyError();
    }

    this.prompt = new Prompt();
    this.locationService = new LocationService(apiKey);
  }

  public async run(): Promise<void> {
    try {
      const city = this.prompt.prompt("Enter a city:");
      const location: LocationDTO = await this.locationService.getCoordinates(city);
      console.log(location.format());
    } catch (error) {
      console.error("Error:", error);
    }
  }
}

const app = new App();
app.run();
