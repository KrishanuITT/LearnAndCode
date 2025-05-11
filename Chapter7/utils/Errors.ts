// errors.ts

export class MissingApiKeyError extends Error {
    constructor() {
      super("API_KEY not defined in environment variables.");
      this.name = "MissingApiKeyError";
    }
  }
  
  export class NetworkError extends Error {
    constructor(status: number, statusText: string) {
      super(`Network error: ${status} ${statusText}`);
      this.name = "NetworkError";
    }
  }
  
  export class NoResultsFoundError extends Error {
    constructor(city: string) {
      super(`No results found for city: ${city}`);
      this.name = "NoResultsFoundError";
    }
  }
