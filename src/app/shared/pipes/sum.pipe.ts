import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sum',
  pure: false
})
export class SumPipe implements PipeTransform {
  transform(items: any[], attr: string): any {
    return items ? items.map(x => +x[attr]).reduce((a, b) => a + b, 0) : [];
  }
}
