import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { catchError, finalize } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';

import { IDataSourceService } from './datasource.service';

export class PaginatedDataSource<T> implements DataSource<T> {
  private resultListSubject = new BehaviorSubject<T[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();

  private results: T[] = [];

  private _pageSize = 20;
  private _count = 0;

  public loading = false;

  public get pageSize() {
    return this._pageSize;
  }

  public set pageSize(val) {
    this._pageSize = val;
  }

  public get count() {
    return this._count;
  }

  public set count(val) {
    this._count = val;
  }

  constructor(private service: IDataSourceService<T>) { }

  public load(page: number = 0, all: boolean = false) {
    this.loadingSubject.next(true);
    this.service
      .load(page + 1, this.pageSize, all)
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe((res: any) => {
        this.count = res.result ? res.result.count : 0;
        this.results = res.result ? res.result.items : [];
        this.resultListSubject.next(this.results);
      });
  }

  public search(payload: any, page: number = 0, all: boolean = false, paginated: boolean = false) {
    this.loadingSubject.next(true);

    this.service
      .search(payload, page + 1, this.pageSize, all, paginated)
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe((res: any) => {
        this.count = res.result ? res.result.count : 0;
        this.results = res.result ? res.result.items : [];
        this.resultListSubject.next(this.results);
      });
  }

  public get(objectId) {
    if (!objectId) {
      throw new Error('Object Id cannot be null');
    }
    const index = this.results.map((item: any) => item.id).indexOf(objectId);
    return this.results[index];
  }

  public add(object: T) {
    this.results.push(object);
    this._incrementCount();
    this.resultListSubject.next(this.results);
  }

  public update(objectId: string, updatedValue: T) {
    const index = this.results.map((item: any) => item.id).indexOf(objectId);
    this.results[index] = updatedValue;
    this.resultListSubject.next(this.results);
  }

  public remove(objectId) {
    const index = this.results.map((item: any) => item.id).indexOf(objectId);
    this.results.splice(index, 1);
    this._decrementCount();
    this.resultListSubject.next(this.results);
  }

  private _incrementCount() {
    this._count++;
  }

  private _decrementCount() {
    this._count--;
  }

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    return this.resultListSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.resultListSubject.complete();
    this.loadingSubject.complete();
  }
}
