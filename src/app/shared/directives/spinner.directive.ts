import { Directive, Input, ElementRef, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[spinner]',
})
export class SpinnerDirective implements OnInit {
  @Input() loading = false;

  constructor(private renderer: Renderer2, private elementRef: ElementRef<any>) {}

  ngOnInit() {
    const element = this.elementRef.nativeElement as HTMLElement;
    console.log('element: ', this.elementRef);
    // if (this.loading) {
      const iconElement = this.renderer.createElement('mat-icon');
      const spinnerElement = this.renderer.createElement('mat-progress-spinner');
      this.renderer.setAttribute(spinnerElement, 'diameter', '20');
      this.renderer.setAttribute(spinnerElement, 'mode', 'indeterminate');
      this.renderer.appendChild(iconElement, spinnerElement);
      this.renderer.appendChild(this.elementRef.nativeElement.children[0], iconElement);
    // }
  }
}
