export interface Domain {
  id: string;
  url: string;
  createdAt: string;
  status: 'pending' | 'copied';
}

export interface CloudinaryConfig {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
}

export interface SyncStats {
  total: number;
  added: number;
  skipped: number;
  lastSync: string | null;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}