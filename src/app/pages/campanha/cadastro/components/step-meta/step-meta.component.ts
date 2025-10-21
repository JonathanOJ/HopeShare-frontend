import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-step-meta',
  templateUrl: './step-meta.component.html',
  styleUrl: './step-meta.component.css',
})
export class StepMetaComponent implements OnChanges {
  @Input() activeStep: number = 0;
  @Input() totalSteps: number = 5;
  @Input() campanhaForm: FormGroup | null = null;
  @Output() onCancel: EventEmitter<void> = new EventEmitter();

  @ViewChild('header', { static: true }) headerTemplate!: TemplateRef<any>;
  @ViewChild('content', { static: true }) contentTemplate!: TemplateRef<any>;

  optionsValues: Array<{
    value: number | 'custom';
    icon: string;
    selected: boolean;
    label?: string;
  }> = [
    {
      value: 100,
      icon: 'hand-heart',
      selected: false,
    },
    {
      value: 1000,
      icon: 'speedometer',
      selected: false,
    },
    {
      value: 5000,
      icon: 'trending-up',
      selected: false,
    },
    {
      value: 10000,
      icon: 'star-outline',
      selected: false,
    },
    {
      value: 20000,
      icon: 'trophy-outline',
      selected: false,
    },
    {
      value: 50000,
      icon: 'crown-outline',
      selected: false,
    },
    {
      value: 'custom',
      icon: 'dots-horizontal-circle-outline',
      selected: false,
      label: 'Outros valores',
    },
  ];

  isCustomValueSelected = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['campanhaForm']) {
      const value = this.campanhaForm?.get('value_required')?.value || null;
      const predefinedOption = this.optionsValues.find((o) => o.value === value);

      if (predefinedOption && predefinedOption.value !== 'custom') {
        this.isCustomValueSelected = false;
        this.optionsValues.forEach((o) => (o.selected = o.value === value));
      } else if (value && typeof value === 'number') {
        this.isCustomValueSelected = true;
        this.custom_value?.setValue(value);
        this.optionsValues.forEach((o) => (o.selected = o.value === 'custom'));
      }
    }
  }

  handleValueSelected(option: any) {
    this.optionsValues.forEach((o) => (o.selected = false));
    option.selected = true;

    if (option.value === 'custom') {
      this.isCustomValueSelected = true;
      this.campanhaForm?.patchValue({
        value_required: null,
        custom_value: null,
      });
    } else {
      this.isCustomValueSelected = false;
      this.campanhaForm?.patchValue({
        value_required: option.value,
        custom_value: null,
      });
    }
  }

  handleCustomValueChange(customValue: number) {
    if (this.isCustomValueSelected && customValue > 0) {
      this.campanhaForm?.patchValue({
        value_required: customValue,
        custom_value: customValue,
      });
    }
  }

  get value_required() {
    return this.campanhaForm?.get('value_required');
  }

  get custom_value() {
    return this.campanhaForm?.get('custom_value');
  }

  isFormInvalid(): boolean {
    if (this.isCustomValueSelected) {
      return (
        !this.campanhaForm?.get('value_required')?.value ||
        !this.campanhaForm?.get('custom_value')?.value ||
        (this.campanhaForm?.get('custom_value')?.invalid ?? false)
      );
    }

    return (
      (this.campanhaForm?.get('value_required')?.invalid ?? false) || !this.campanhaForm?.get('value_required')?.value
    );
  }
}

