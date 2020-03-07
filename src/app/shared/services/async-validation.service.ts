import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';

import { ApiService } from './api.service';
import { ApiResponse } from './../../models/api-response.model';
import { IdentityResult } from '../../models/identity-result.model';

type KeyValue = { [key: string]: string };

@Injectable()
export class AsyncValidationService {
  constructor(private apiService: ApiService) {}

  checkUserAvailibility(prop: KeyValue, userId?: string): Observable<boolean> {
    const payload = { ...prop, userId };
    return this.apiService.post<ApiResponse<IdentityResult>>('/users/validation', payload).pipe(
      debounceTime(300),
      map(response => response.success ? response.result.isValid : false)
    );
  }
}
