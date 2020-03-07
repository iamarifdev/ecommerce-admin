import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { AuthUser } from '../../models/auth-user.model';
import { User } from './models/user.model';
import { ApiService, UtilityService } from '../../../app/shared/services';
import { ApiResponse, ApiPaginatedResponse } from '../../../app/models/api-response.model';
import { IDataSourceService } from '../../../app/base/datasource.service';
import { Role } from '../roles/models/role.model';

@Injectable()
export class UsersService implements IDataSourceService<User> {
  constructor(private apiService: ApiService, private utilService: UtilityService) { }

  public addUser(user: User): Observable<ApiResponse<User>> {
    return this.apiService.post<ApiResponse<User>>('/users/add', user).pipe(
      catchError(error => {
        this.utilService.openErrorSnackBar(error.error.message);
        return of(null);
      })
    );
  }

  public getUserById(id: string): Observable<ApiResponse<User>> {
    return this.apiService.get<ApiResponse<User>>(`/users/id/${id}`).pipe(
      catchError(error => {
        this.utilService.openErrorSnackBar(error.error.message);
        return of(null);
      })
    );
  }

  public updateUserById(id: string, user: User): Observable<ApiResponse<User>> {
    return this.apiService.put<ApiResponse<User>>(`/users/update/${id}`, user).pipe(
      catchError(error => {
        this.utilService.openErrorSnackBar(error.error.message);
        return of(null);
      })
    );
  }

  public uploadProfile(id: string, file: File): Observable<ApiResponse<string>> {
    return this.apiService.postFile<ApiResponse<string>>(`/users/upload/profile/${id}`, file, 'profile').pipe(
      catchError(error => {
        this.utilService.openErrorSnackBar(error.error.message);
        return of(null);
      })
    );
  }

  public toggoleActivation(user: User, status: boolean): Observable<ApiResponse<User>> {
    return this.apiService.put<ApiResponse<User>>(`/users/activate/${user.id}`, { status }).pipe(
      catchError(error => {
        this.utilService.openErrorSnackBar(error.error.message);
        return of(null);
      })
    );
  }

  public getRoleDropdownItems(): Observable<ApiResponse<Role[]>> {
    return this.apiService.get<ApiResponse<Role[]>>(`/roles/dropdown/list`).pipe(
      catchError(error => {
        this.utilService.openErrorSnackBar(error.error.message);
        return of(null);
      })
    );
  }

  public getAll() {
    return this.apiService
      .get<ApiPaginatedResponse<User>>(`/users/list`)
      .pipe(map(res => (res.result ? res.result.items : [])));
  }

  public load(page: number = 1, pageSize: number = 20, all: boolean = false) {
    return this.apiService.get<ApiPaginatedResponse<User>>(
      `/users/list?all=${all}&page=${page}&pageSize=${pageSize}`
    );
  }

  public search(payload: any, page: number = 1, pageSize: number = 20) {
    return this.apiService.post<ApiPaginatedResponse<User>>(
      `/users/list?page=${page}&pageSize=${pageSize}`,
      payload
    );
  }

  public remove(id: string) {
    return this.apiService.delete(`/users/delete/${id}`);
  }
}
