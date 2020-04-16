import {
  Directive,
  Input,
  OnDestroy,
  ComponentRef,
  ViewContainerRef,
  ComponentFactoryResolver,
} from '@angular/core';

import { ButtonLoaderComponent } from '../components';

@Directive({
  selector: '[spinner]',
})
export class SpinnerDirective implements OnDestroy {
  private componentInstance: ComponentRef<ButtonLoaderComponent> = null;

  @Input()
  set loading(value: boolean) {
    this.toggleLoader(value);
  }

  @Input()
  set size(value: number) {
    this.componentInstance.instance.size = value;
  }

  constructor(private viewContainerRef: ViewContainerRef, private componentFactoryResolver: ComponentFactoryResolver) {}

  toggleLoader(value: boolean) {
    if (!this.componentInstance) {
      this.createLoaderComponent();
      this.makeComponentAChild();
    }

    this.componentInstance.instance.loading = value;
  }

  private createLoaderComponent() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ButtonLoaderComponent);
    this.componentInstance = this.viewContainerRef.createComponent(componentFactory);
  }

  private makeComponentAChild() {
    const loaderComponentElement = this.componentInstance.location.nativeElement;
    const sibling: HTMLElement = loaderComponentElement.previousSibling;
    sibling.children[0].classList.add('button-loader-container');
    sibling.children[0].prepend(loaderComponentElement);
  }

  ngOnDestroy(): void {
    if (this.componentInstance) {
      this.componentInstance.destroy();
    }
  }
}
