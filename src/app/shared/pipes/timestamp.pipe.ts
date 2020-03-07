import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'timestamp'
})
export class TimestampPipe implements PipeTransform {
  constructor(private datePipe: DatePipe) {}
  /**
   * Takes a value and returns formatted date.
   */
  transform(value: string, lang: string = 'en') {
    if (!value) {
      return '';
    }
    const format = lang === 'en' ? 'MM-dd-yyyy HH:mm' : 'dd-MM-yyyy HH:mm';
    const timeFormat = 'HH:mm:ss';

    const messageDay = new Date(value);

    const todayMidnight = new Date();
    todayMidnight.setHours(0, 0, 0);

    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 1);

    const yesterdayMidnight = new Date(currentDate);
    yesterdayMidnight.setHours(0, 0, 0);

    const today = lang === 'en' ? 'Today' : 'vandaag';
    const yesterday = lang === 'en' ? 'Yesterday' : 'gisteren';

    if (messageDay >= todayMidnight) {
      return today + ' ' + this.datePipe.transform(value, timeFormat);
    } else if (messageDay >= yesterdayMidnight) {
      return yesterday + ' ' + this.datePipe.transform(value, timeFormat);
    } else {
      return this.datePipe.transform(value, format);
    }
  }
}
