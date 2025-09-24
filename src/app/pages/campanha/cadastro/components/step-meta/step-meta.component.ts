import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Campanha } from '../../../../../shared/models/campanha.model';

@Component({
  selector: 'app-step-meta',
  templateUrl: './step-meta.component.html',
  styleUrl: './step-meta.component.css',
})
export class StepMetaComponent implements OnInit, OnChanges {
  @Input() activeStep: number = 0;
  @Input() totalSteps: number = 5;
  @Input() campanha: Campanha | null = null;
  @Output() onCancel: EventEmitter<void> = new EventEmitter();
  @Output() formUpdate: EventEmitter<FormGroup> = new EventEmitter();

  @ViewChild('header', { static: true }) headerTemplate!: TemplateRef<any>;
  @ViewChild('content', { static: true }) contentTemplate!: TemplateRef<any>;

  stepMetaForm!: FormGroup;

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

  private fb = inject(FormBuilder);

  ngOnInit(): void {
    if (!this.stepMetaForm) {
      this.initializeForm();
    }
  }

  initializeForm() {
    this.stepMetaForm = this.fb.group({
      value_required: [this.campanha?.value_required || null, Validators.required],
      custom_value: [null, [Validators.min(1)]], // Campo para valor customizado
    });

    if (this.campanha?.value_required) {
      const existingValue = this.campanha.value_required;
      const predefinedOption = this.optionsValues.find((o) => o.value === existingValue);

      if (predefinedOption) {
        predefinedOption.selected = true;
      } else {
        const customOption = this.optionsValues.find((o) => o.value === 'custom');
        if (customOption) {
          customOption.selected = true;
          this.isCustomValueSelected = true;
          this.stepMetaForm.patchValue({ custom_value: existingValue });
        }
      }
    }

    this.stepMetaForm.valueChanges.subscribe(() => {
      this.formUpdate.emit(this.stepMetaForm);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['campanha'] && this.campanha && this.stepMetaForm) {
      const value = this.campanha.value_required || null;
      const predefinedOption = this.optionsValues.find((o) => o.value === value);

      if (predefinedOption && predefinedOption.value !== 'custom') {
        this.stepMetaForm.patchValue(
          {
            value_required: value,
            custom_value: null,
          },
          { emitEvent: false }
        );

        this.isCustomValueSelected = false;
        this.optionsValues.forEach((o) => (o.selected = o.value === value));
      } else if (value && typeof value === 'number') {
        this.stepMetaForm.patchValue(
          {
            value_required: value,
            custom_value: value,
          },
          { emitEvent: false }
        );

        this.isCustomValueSelected = true;
        this.optionsValues.forEach((o) => (o.selected = o.value === 'custom'));
      }
    }
  }

  handleValueSelected(option: any) {
    this.optionsValues.forEach((o) => (o.selected = false));
    option.selected = true;

    if (option.value === 'custom') {
      this.isCustomValueSelected = true;
      this.stepMetaForm.patchValue({
        value_required: null,
        custom_value: null,
      });
    } else {
      this.isCustomValueSelected = false;
      this.stepMetaForm.patchValue({
        value_required: option.value,
        custom_value: null,
      });
    }
  }

  handleCustomValueChange(customValue: number) {
    if (this.isCustomValueSelected && customValue > 0) {
      this.stepMetaForm.patchValue({
        value_required: customValue,
        custom_value: customValue,
      });
    }
  }

  get value_required() {
    return this.stepMetaForm.get('value_required');
  }

  get custom_value() {
    return this.stepMetaForm.get('custom_value');
  }

  isFormInvalid(): boolean {
    if (this.isCustomValueSelected) {
      return (
        !this.stepMetaForm.get('value_required')?.value ||
        !this.stepMetaForm.get('custom_value')?.value ||
        (this.stepMetaForm.get('custom_value')?.invalid ?? false)
      );
    }

    return (
      (this.stepMetaForm.get('value_required')?.invalid ?? false) || !this.stepMetaForm.get('value_required')?.value
    );
  }
}

