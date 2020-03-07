import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class AsyncService {
  private loadingEvent$: EventEmitter<boolean>;
  private isLoading: boolean;

  constructor() {
    this.loadingEvent$ = new EventEmitter(true);
    this.loadingEvent$.subscribe((event: boolean) => this.isLoading = event);
  }

  get loading() {
    return this.isLoading;
  }

  start() {
    this.loadingEvent$.emit(true);
  }

  finish() {
    this.loadingEvent$.emit(false);
  }
}
