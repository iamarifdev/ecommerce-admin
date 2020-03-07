import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MaterialModule } from './material.module';
import { SpinnerComponent } from './components/spinner.component';
import {
  OnlyNumberDirective,
  AccordionAnchorDirective,
  AccordionLinkDirective,
  AccordionDirective
} from './directives';
import { SumPipe, TimeAgoPipe, TimestampPipe, ConcatPipe } from './pipes';
import { UtilityService, DialogService, AsyncService, AsyncValidationService } from './services';
import { ParticlesComponent, AvatarComponent, ConfirmationDialogComponent, ProgressBarComponent } from './components';

@NgModule({
  declarations: [
    SpinnerComponent,
    ParticlesComponent,
    AvatarComponent,
    ConfirmationDialogComponent,
    ProgressBarComponent,
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective,
    OnlyNumberDirective,
    SumPipe,
    ConcatPipe,
    TimeAgoPipe,
    TimestampPipe
  ],
  entryComponents: [ConfirmationDialogComponent],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MaterialModule],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    SpinnerComponent,
    ParticlesComponent,
    AvatarComponent,
    ConfirmationDialogComponent,
    ProgressBarComponent,
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective,
    OnlyNumberDirective,
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
