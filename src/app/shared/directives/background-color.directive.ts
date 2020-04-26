import { Directive, Input, ElementRef } from '@angular/core';

@Directive({
  selector: '[backgroundColor]'
})
export class BackgroundColorDirective {
  private colorCode: string;

  @Input()
  public set backgroundColor(color: string) {
    this.colorCode = color;
    this.changeBackgroundColor();
  }

  @Input()
  public selectorClass: string;

  constructor(private elementRef: ElementRef) {}

  private changeBackgroundColor(): void {
    if (this.selectorClass) {
      const node = this.elementRef.nativeElement.querySelector(`.${this.selectorClass}`) as HTMLElement;
      if (node) {
        node.style.setProperty('background-color', this.colorCode);
      }
    } else {
      this.elementRef.nativeElement.style.setProperty('background-color', this.colorCode);
    }
  }
}
