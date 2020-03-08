import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Role } from './models/role.model';
import { ApiService, UtilityService } from '../../../app/shared/services';
import { ApiResponse, ApiPagedResponse } from '../../../app/models/api-response.model';
import { IDataSourceService } from '../../../app/base/datasource.service';

@Injectable()
export class RolesService implements IDataSourceService<Role> {
  constructor(private apiService: ApiService, private utilService: UtilityService) {}

  public addRole(role: Role): Observable<ApiResponse<Role>> {
    return this.apiService.post<ApiResponse<Role>>('/roles/add', role).pipe(
      catchError(error => {
        this.utilService.openErrorSnackBar(error.error.message);
        return of(null);
      })
    );
  }

  public getRoleById(id: string): Observable<ApiResponse<Role>> {
    return this.apiService.get<ApiResponse<Role>>(`/roles/id/${id}`).pipe(
      catchError(error => {
        this.utilService.openErrorSnackBar(error.error.message);
        return of(null);
      })
    );
  }

  public updateRoleById(id: string, role: Role): Observable<ApiResponse<Role>> {
    return this.apiService.put<ApiResponse<Role>>(`/roles/update/${id}`, role).pipe(
      catchError(error => {
        this.utilService.openErrorSnackBar(error.error.message);
        return of(null);
      })
    );
  }

  public toggoleActivation(role: Role, status: boolean): Observable<ApiResponse<Role>> {
    return this.apiService
      .put<ApiResponse<Role>>(`/roles/activate/${role.id}`, { status })
      .pipe(
        catchError(error => {
          this.utilService.openErrorSnackBar(error.error.message);
          return of(null);
        })
      );
  }

  public getAll() {
    return this.apiService
      .get<ApiPagedResponse<Role>>(`/roles/list`)
      .pipe(map(res => (res.result ? res.result.items : [])));
  }

  public load(page: number = 1, pageSize: number = 20, all: boolean = false) {
    return this.apiService.get<ApiPagedResponse<Role>>(`/roles/list?all=${all}&page=${page}&pageSize=${pageSize}`);
  }

  public search(payload: any, page: number = 1, pageSize: number = 20) {
    return this.apiService.post<ApiPagedResponse<Role>>(`/roles/list?page=${page}&pageSize=${pageSize}`, payload);
  }

  public remove(id: string) {
    return this.apiService.delete(`/roles/delete/${id}`);
  }
}
