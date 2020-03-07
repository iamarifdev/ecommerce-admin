import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'concat',
  pure: false
})
export class ConcatPipe implements PipeTransform {
  transform(items: any[], prop: string): any {
    return items && items.length ? items.map(item => item[prop]).join(', ') : null;
  }
}
