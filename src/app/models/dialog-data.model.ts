import { ComponentType } from '@angular/cdk/portal';

export class DialogData {
  title: string;
  content?: string;
  component?: ComponentType<any>
}
