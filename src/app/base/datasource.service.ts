import { Observable } from 'rxjs';
import { ApiPaginatedResponse } from '../../app/models/api-response.model';

export declare interface IDataSourceService<T> {
  load: (page: number, pageSize: number, all: boolean) => Observable<ApiPaginatedResponse<T>>;
  search: (
    payload: any,
    page: number,
    pageSize: number,
    all: boolean,
    paginated: boolean
  ) => Observable<ApiPaginatedResponse<T>>;
}
