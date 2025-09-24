import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-input-text-validation',
  template: `
    <div *ngIf="shouldShowErrors()" class="p-error">
      <small *ngIf="formGroup.get(fieldName)?.errors?.['required']"> Campo obrigatório. </small>
      <small *ngIf="formGroup.get(fieldName)?.errors?.['minlength']">
        Campo deve ter no mínimo
        {{ this.formGroup.get(this.fieldName)?.errors?.['minlength'].requiredLength }}
        caracteres.
      </small>
      <small *ngIf="formGroup.get(fieldName)?.errors?.['maxlength']">
        Campo deve ter no máximo
        {{ this.formGroup.get(this.fieldName)?.errors?.['maxlength'].requiredLength }}
        caracteres.
      </small>
    </div>
  `,
  styles: [
    `
      .p-error {
        color: red;
      }
    `,
  ],
})
export class InputTextValidationComponent {
  @Input() formGroup!: FormGroup;
  @Input() fieldName!: string;

  shouldShowErrors(): boolean {
    const control = this.formGroup.get(this.fieldName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }
}
