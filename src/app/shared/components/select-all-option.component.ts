import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'select-all-option',
  template: `
    <mat-checkbox
      class="mat-option"
      [indeterminate]="isIndeterminate()"
      [checked]="isChecked()"
      (click)="$event.stopPropagation()"
      (change)="toggleSelection($event)"
    >
      {{ text }}
    </mat-checkbox>
  `,
  styles: [
    `
      app-select-check-all .mat-checkbox-layout,
      app-select-check-all .mat-checkbox-label {
        width: 100% !important;
      }
    `
  ]
})
export class SelectAllOptionComponent {
  @Input() model: FormControl;
  @Input() values = [];
  @Input() text = 'Select All';

  isChecked(): boolean {
    return this.model.value && this.values.length && this.model.value.length === this.values.length;
  }

  isIndeterminate(): boolean {
    return (
      this.model.value && this.values.length && this.model.value.length && this.model.value.length < this.values.length
    );
  }

  toggleSelection(change: MatCheckboxChange): void {
    if (change.checked) {
      this.model.setValue(this.values);
    } else {
      this.model.setValue([]);
    }
  }
}
