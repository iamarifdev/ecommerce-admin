import { Observable } from 'rxjs';
import { ApiPagedResponse } from '../../app/models/api-response.model';

export declare interface IDataSourceService<T> {
  load: (page: number, pageSize: number, all: boolean) => Observable<ApiPagedResponse<T>>;
  search: (
    payload: any,
    page: number,
    pageSize: number,
    all: boolean,
    paginated: boolean
  ) => Observable<ApiPagedResponse<T>>;
}
