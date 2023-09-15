import { DEFAULT_PAGE, PER_PAGE } from './constant';

export class QueryPagingDto {
  page: number = DEFAULT_PAGE;
  perPage: number = PER_PAGE;
}
