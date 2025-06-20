export class SessionStore {
    private static userId: string | null = null;
  
    static setUserId(id: string) {
      SessionStore.userId = id;
    }
  
    static getUserId(): string | null {
      return SessionStore.userId;
    }
  
    static clear() {
      SessionStore.userId = null;
    }
  }
  