export class SessionStore {
  private static userId: string | null = null;
  private static token: string | null = null;

  static setUserId(id: string) {
    SessionStore.userId = id;
  }

  static getUserId(): string | null {
    return SessionStore.userId;
  }

  static setToken(token: string) {
    SessionStore.token = token;
  }

  static getToken(): string | null {
    return SessionStore.token;
  }

  static clear() {
    SessionStore.userId = null;
    SessionStore.token = null;
  }
}
