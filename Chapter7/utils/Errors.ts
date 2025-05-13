import { ERROR_API_KEY_MISSING, ERROR_MSG_NETWORK, ERROR_MSG_NO_RESULTS, ERROR_NAME_API_KEY, ERROR_NAME_NETWORK, ERROR_NAME_NO_RESULTS } from "../constants/errorConstants";

export class MissingApiKeyError extends Error {
  constructor() {
    super(ERROR_API_KEY_MISSING);
    this.name = ERROR_NAME_API_KEY;
  }
}

export class NetworkError extends Error {
  constructor(status: number, statusText: string) {
    super(ERROR_MSG_NETWORK(status, statusText));
    this.name = ERROR_NAME_NETWORK;
  }
}

export class NoResultsFoundError extends Error {
  constructor(city: string) {
    super(ERROR_MSG_NO_RESULTS(city));
    this.name = ERROR_NAME_NO_RESULTS;
  }
}