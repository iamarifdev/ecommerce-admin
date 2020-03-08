import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { environment } from '../../../environments/environment';

@Injectable()
export class ApiService {
  constructor(private http: HttpClient, private storageService: StorageService) {}

  private getHeaders() {
    const headerContent = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.storageService.getAccessToken()}`,
      lang: this.storageService.getLanguageCode()
    });
    return headerContent;
  }

  private getFileHeaders() {
    const headerContent = new HttpHeaders({
      Authorization: `Bearer ${this.storageService.getAccessToken()}`,
      lang: this.storageService.getLanguageCode()
    });
    return headerContent;
  }

  get<T>(path: string, params: HttpParams = new HttpParams()): Observable<T> {
    const headers = this.getHeaders();
    return this.http.get<T>(`${environment.API_BASE}${path}`, { params, headers });
  }

  put<T>(path: string, body: object = {}): Observable<T> {
    const headers = this.getHeaders();
    return this.http.put<T>(`${environment.API_BASE}${path}`, JSON.stringify(body), { headers });
  }

  post<T>(path: string, body: object = {}): Observable<T> {
    const headers = this.getHeaders();

    return this.http.post<T>(`${environment.API_BASE}${path}`, JSON.stringify(body), { headers });
  }

  postFile<T>(path: string, fileToUpload: File, fileKey = 'file', payload: any = null): Observable<T> {
    const formData: FormData = new FormData();
    formData.append(fileKey, fileToUpload, fileToUpload.name);

    if (payload) {
      const keys = Object.keys(payload);

      keys.forEach(key => {
        formData.append(key, payload[key]);
      });
    }

    return this.http.post<T>(`${environment.API_BASE}${path}`, formData, {
      headers: this.getFileHeaders()
    });
  }

  postFilesWithPayload<T>(path: string, filesToUpload: File[], fileKey = 'file', payload: any = null): Observable<T> {
    const formData: FormData = new FormData();
    filesToUpload.forEach(file => {
      formData.append(fileKey, file, file.name);
    });
    if (payload) {
      const keys = Object.keys(payload);

      keys.forEach(key => {
        formData.append(key, payload[key]);
      });
    }

    return this.http.post<T>(`${environment.API_BASE}${path}`, formData, {
      headers: this.getFileHeaders()
    });
  }

  downloadCSV<T>(path: string, body: object = {}): Observable<T> {
    return this.http.post<T>(`${environment.API_BASE}${path}`, body, {
      headers: this.getHeaders(),
      responseType: 'text' as any
    });
  }

  delete<T = any>(path): Observable<T> {
    const headers = this.getHeaders();
    return this.http.delete<T>(`${environment.API_BASE}${path}`, { headers });
  }
}
