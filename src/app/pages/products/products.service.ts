import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ApiResponse, ApiPagedResponse } from '../../../app/models/api-response.model';
import { ApiService, UtilityService } from '../../../app/shared/services';
import { IDataSourceService } from '../../../app/base/datasource.service';
import { IProduct, IProductListItem, IProductAdd } from './models';

@Injectable()
export class ProductsService implements IDataSourceService<IProductListItem> {
  private baseUrl = '/products';

  constructor(private apiService: ApiService, private utilService: UtilityService) {}

  public addProduct(product: IProductAdd): Observable<ApiResponse<IProduct>> {
    return this.apiService.post<ApiResponse<IProduct>>(`${this.baseUrl}/add`, product).pipe(
      catchError(error => {
        this.utilService.openErrorSnackBar(error.error.message);
        return of(null);
      })
    );
  }

  public getProductById(id: string): Observable<ApiResponse<IProduct>> {
    return this.apiService.get<ApiResponse<IProduct>>(`${this.baseUrl}/${id}`).pipe(
      catchError(error => {
        this.utilService.openErrorSnackBar(error.error.message);
        return of(null);
      })
    );
  }

  public updateProductById(id: string, user: IProduct): Observable<ApiResponse<IProduct>> {
    return this.apiService.put<ApiResponse<IProduct>>(`${this.baseUrl}/update/${id}`, user).pipe(
      catchError(error => {
        this.utilService.openErrorSnackBar(error.error.message);
        return of(null);
      })
    );
  }

  public uploadFeatureImage(productId: string, file: File): Observable<ApiResponse<string>> {
    return this.apiService
      .postFile<ApiResponse<string>>(`${this.baseUrl}/${productId}/upload/feature-image`, file, 'featureImage')
      .pipe(
        catchError(error => {
          this.utilService.openErrorSnackBar(error.error.message);
          return of(null);
        })
      );
  }

  public uploadImages(productId: string, color: string, files: File[]): Observable<ApiResponse<string>> {
    return this.apiService
      .postFilesWithPayload<ApiResponse<string>>(`${this.baseUrl}/${productId}/upload/images/${color}`, files, 'images')
      .pipe(
        catchError(error => {
          this.utilService.openErrorSnackBar(error.error.message);
          return of(null);
        })
      );
  }

  public toggoleActivation(user: IProduct, status: boolean): Observable<ApiResponse<IProduct>> {
    return this.apiService
      .put<ApiResponse<IProduct>>(`${this.baseUrl}/activate/${user.id}`, { status })
      .pipe(
        catchError(error => {
          this.utilService.openErrorSnackBar(error.error.message);
          return of(null);
        })
      );
  }

  // public getRoleDropdownItems(): Observable<ApiResponse<Role[]>> {
  //   return this.apiService.get<ApiResponse<Role[]>>(`/roles/dropdown/list`).pipe(
  //     catchError(error => {
  //       this.utilService.openErrorSnackBar(error.error.message);
  //       return of(null);
  //     })
  //   );
  // }

  public getAll() {
    return this.apiService
      .get<ApiPagedResponse<IProductListItem>>(`${this.baseUrl}/list`)
      .pipe(map(res => (res.result ? res.result.items : [])));
  }

  public load(page: number = 1, pageSize: number = 20, all: boolean = false) {
    return this.apiService.get<ApiPagedResponse<IProductListItem>>(
      `${this.baseUrl}/list?all=${all}&page=${page}&pageSize=${pageSize}`
    );
  }

  public search(payload: any, page: number = 1, pageSize: number = 20) {
    return this.apiService.post<ApiPagedResponse<IProductListItem>>(
      `${this.baseUrl}/list?page=${page}&pageSize=${pageSize}`,
      payload
    );
  }

  public remove(productId: string) {
    return this.apiService.delete(`${this.baseUrl}/delete/${productId}`);
  }
}
