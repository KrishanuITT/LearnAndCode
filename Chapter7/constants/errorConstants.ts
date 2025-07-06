export const ERROR_API_KEY_MISSING = "API_KEY not defined in environment variables.";
export const ERROR_NAME_API_KEY = "MissingApiKeyError";

export const ERROR_NAME_NETWORK = "NetworkError";
export const ERROR_MSG_NETWORK = (status: number, statusText: string) =>
  `Network error: ${status} ${statusText}`;

export const ERROR_NAME_NO_RESULTS = "NoResultsFoundError";
export const ERROR_MSG_NO_RESULTS = (city: string) =>
  `No results found for city: ${city}`;
