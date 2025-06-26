export class ExternalServerDTO {
  apiKey: string;
  id: number;
  isActive: boolean;
  lastAccessed: Date | null;
  name: string;

  constructor(data: { api_key: string; id: number; is_active: boolean; last_accessed: Date | null; name: string }) {
    this.apiKey = data.api_key;
    this.id = data.id;
    this.name = data.name;
    this.isActive = data.is_active;
    this.lastAccessed = data.last_accessed;
  }
}
