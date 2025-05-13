import { LocationDTO } from "./dto/LocationDTO";
import { BASE_URL, LIMIT } from "./utils/constants";
import { NetworkError, NoResultsFoundError } from "./utils/Errors";

export class LocationService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getCoordinates(city: string): Promise<LocationDTO> {
    const cityParam = `q=${encodeURIComponent(city)}`;
    const limitParam = `limit=${LIMIT}`;
    const apiKeyParam = `appid=${this.apiKey}`;
    const url = `${BASE_URL}?${cityParam}&${limitParam}&${apiKeyParam}`;

    const response = await fetch(url);
    if (!response.ok) throw new NetworkError(response.status, response.statusText);

    const data = await response.json();
    if (data.length === 0) throw new NoResultsFoundError(city);

    const { name, country, lat, lon } = data[0];
    return new LocationDTO(name, country, lat, lon);
  }
}
