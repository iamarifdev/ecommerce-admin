import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class UtilityService {
  public static requestDateFormat = 'MM-dd-yyyy';

  constructor(private snackbar: MatSnackBar) {}

  openSuccessSnackBar(message: string) {
    return this.snackbar.open(message, 'Success');
  }

  openErrorSnackBar(message: string) {
    return this.snackbar.open(message, 'Error', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  openWarningSnackBar(message: string) {
    return this.snackbar.open(message, 'Warning', {
      panelClass: ['warning-snackbar']
    });
  }

  findItemInListById(itemList, item): Object {
    return itemList.map(el => el.id).indexOf(item.id);
  }

  hasItemInListById(itemList, item): boolean {
    const index = itemList.map(el => el.id).indexOf(item.id);
    return index >= 0;
  }

  dateDifference(listData: any, userId: string = null) {
    listData.map(listItem => {
      if (listItem.hasOwnProperty('createdAt')) {
        const messageDay = new Date(listItem.createdAt);
        const todayMidnight = new Date();
        todayMidnight.setHours(0, 0, 0);
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - 1);
        const yesterdayMidnight = new Date(currentDate);
        yesterdayMidnight.setHours(0, 0, 0);
        if (messageDay >= todayMidnight) {
          listItem['isDateLabel'] = true;
          listItem['dateLabel'] = 'Today';
        } else if (messageDay >= yesterdayMidnight) {
          listItem['isDateLabel'] = true;
          listItem['dateLabel'] = 'Yesterday';
        } else {
          listItem['isDateLabel'] = false;
          listItem['dateLabel'] = '';
        }
        let x = null;
        x = listItem.recipients.find(obj => {
          return obj.id === userId;
        });
        if (x && x.seen) {
          listItem['msgSeen'] = x.seen;
        }
      }
    });
    return listData;
  }

  isSameDay(firstDate: any, secondDate: any) {
    const day1 = new Date(firstDate);
    const day2 = new Date(secondDate);

    return (
      day1.getFullYear() === day2.getFullYear() &&
      day1.getMonth() === day2.getMonth() &&
      day1.getDate() === day2.getDate()
    );
  }

  isCurrentWeek(date: Date) {
    const currentWeek = this.getWeekNumber(new Date());
    const selectedWeek = this.getWeekNumber(date);

    return currentWeek === selectedWeek;
  }

  private getWeekNumber(date: Date) {
    const d: any = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart: any = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    return weekNo;
  }
}
