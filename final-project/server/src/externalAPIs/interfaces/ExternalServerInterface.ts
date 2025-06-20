export interface ExternalServer {
    api_key: string;
    created_at: Date;
    id: number;
    is_active: boolean;
    last_accessed: Date | null;
    name: string;
    updated_at: Date;
  }
  