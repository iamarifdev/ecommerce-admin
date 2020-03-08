export interface ApiResponse<T = any> {
  success: boolean;
  result?: T;
  message?: string;
}

export interface ApiPagedResponse<T = any> {
  success: boolean;
  result?: {
    items: T[];
    count: number;
  };
  message?: string;
}
