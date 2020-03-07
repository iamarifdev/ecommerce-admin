import { OnDestroy, ChangeDetectorRef, Pipe, PipeTransform } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable, of, timer } from 'rxjs';
import { repeatWhen, takeWhile, map } from 'rxjs/operators';

@Pipe({
  name: 'timeAgo',
  pure: false
})
export class TimeAgoPipe implements PipeTransform, OnDestroy {
  private readonly async: AsyncPipe;

  private isDestroyed = false;
  private value: Date;
  private timer: Observable<string>;

  constructor(ref: ChangeDetectorRef) {
    this.async = new AsyncPipe(ref);
  }

  public transform(obj: any, ...args: any[]): any {
    if (obj == null) {
      return '';
    }

    if (!(obj instanceof Date)) {
      this.value = new Date(obj);
      if (!this.value) {
        throw new Error('TimeAgoPipe works only with Dates');
      }
    } else {
      this.value = obj;
    }

    if (!this.timer) {
      this.timer = this.getObservable();
    }

    return this.async.transform(this.timer);
  }

  public now(): Date {
    return new Date();
  }

  public ngOnDestroy() {
    this.isDestroyed = true;
    // on next interval, will complete
  }

  private getObservable() {
    return of(1).pipe(
      repeatWhen((notifications: any) => {
        // for each next raised by the source sequence, map it to the result of the returned observable
        return notifications.flatMap((x, i) => {
          const sleep = i < 60 ? 1000 : 30000;
          return timer(sleep);
        });
      }),
      takeWhile(_ => !this.isDestroyed),
      map((x, i) => this.elapsed())
    );
  }

  private elapsed(): string {
    const now = this.now().getTime();

    // time since message was sent in seconds
    const delta = (now - this.value.getTime()) / 1000;
    let time = 0;
    let unit = '';

    // format string
    if (delta < 60) {
      // sent in last minute
      return `${Math.floor(delta)} seconds ago`;
    } else if (delta < 3600) {
      // sent in last hour
      time = Math.floor(delta / 60);
      unit = 'minute';
    } else if (delta < 86400) {
      // sent on last day
      time = Math.floor(delta / 3600);
      unit = 'hour';
    } else {
      // sent more than one day ago
      time = Math.floor(delta / 86400);
      unit = 'day';
    }
    return `${time} ${unit}` + (time < 2 ? `` : `s`) + ` ago`;
  }
}
