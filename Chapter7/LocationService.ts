import { LocationDTO } from "./dto/LocationDTO";import { NetworkError, NoResultsFoundError } from "./utils/Errors";
;

export class LocationService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getCoordinates(city: string): Promise<LocationDTO> {
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${this.apiKey}`;

    const response = await fetch(url);
    if (!response.ok) throw new NetworkError(response.status, response.statusText);

    const data = await response.json();
    if (data.length === 0) throw new NoResultsFoundError(city);

    const { name, country, lat, lon } = data[0];
    return new LocationDTO(name, country, lat, lon);
  }
}
