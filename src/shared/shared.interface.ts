export interface IResponsePaging<T> {
    result: T[];
    total: number;
    totalPages: number;
  }
