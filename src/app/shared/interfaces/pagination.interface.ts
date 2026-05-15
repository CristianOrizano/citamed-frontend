export interface PaginatedRequest {
  page: number;
  size: number;
  sortBy?: string;
  sortDir?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  currentPage: number;
  perPage: number;
  totalPages: number;
  totalElements: number;
}
