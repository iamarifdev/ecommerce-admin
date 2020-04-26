import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { MaterialModule } from './material.module';
import {
  OnlyNumberDirective,
  AccordionAnchorDirective,
  AccordionLinkDirective,
  AccordionDirective
} from './directives';
import { SumPipe, TimeAgoPipe, TimestampPipe, ConcatPipe } from './pipes';
import { UtilityService, DialogService, AsyncService, AsyncValidationService } from './services';
import {
  ParticlesComponent,
  AvatarComponent,
  ConfirmationDialogComponent,
  ProgressBarComponent,
  SelectAllOptionComponent,
  SpinnerComponent,
  ButtonLoaderComponent
} from './components';
import { SpinnerDirective, BackgroundColorDirective } from './directives';

@NgModule({
  declarations: [
    SpinnerComponent,
    ButtonLoaderComponent,
    ParticlesComponent,
    AvatarComponent,
    ConfirmationDialogComponent,
    ProgressBarComponent,
    SelectAllOptionComponent,
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective,
    OnlyNumberDirective,
    SpinnerDirective,
    BackgroundColorDirective,
    SumPipe,
    ConcatPipe,
    TimeAgoPipe,
    TimestampPipe
  ],
  entryComponents: [ConfirmationDialogComponent, ButtonLoaderComponent],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MaterialModule, TranslateModule],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    TranslateModule,
    SpinnerComponent,
    ButtonLoaderComponent,
    ParticlesComponent,
    AvatarComponent,
    ConfirmationDialogComponent,
    ProgressBarComponent,
    SelectAllOptionComponent,
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective,
    OnlyNumberDirective,
    SpinnerDirective,
    BackgroundColorDirective,
    SumPipe,
    ConcatPipe,
    TimeAgoPipe,
    TimestampPipe
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [UtilityService, DialogService, AsyncService, AsyncValidationService]
    };
  }
}
