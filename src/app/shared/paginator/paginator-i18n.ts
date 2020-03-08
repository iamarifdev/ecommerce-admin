import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';

export class PaginatorI18n extends MatPaginatorIntl {
  private translate: TranslateService;

  injectTranslateService(translate: TranslateService) {
    this.translate = translate;

    this.translate.onLangChange.subscribe(() => {
      this.translateLabels();
    });

    this.translateLabels();
  }

  translateLabels() {
    this.itemsPerPageLabel = this.translate.instant('PAGINATOR.ITEMS_PER_PAGE_LABEL');
    this.nextPageLabel = this.translate.instant('PAGINATOR.NEXT_PAGE_LABEL');
    this.previousPageLabel = this.translate.instant('PAGINATOR.PREVIOUS_PAGE_LABEL');
    this.firstPageLabel = this.translate.instant('PAGINATOR.FIRST_PAGE_LABEL');
    this.lastPageLabel = this.translate.instant('PAGINATOR.LAST_PAGE_LABEL');
  }

  getRangeLabel = function(page: number, pageSize: number, length: number): string {
    if (length === 0 || pageSize === 0) {
      return this.translate.instant('PAGINATOR.RANGE_PAGE_LABEL_1', { length });
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return this.translate.instant('PAGINATOR.RANGE_PAGE_LABEL_2', {
      startIndex: startIndex + 1,
      endIndex,
      length
    });
  };
}
