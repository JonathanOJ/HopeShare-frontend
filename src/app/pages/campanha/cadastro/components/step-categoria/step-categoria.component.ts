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
  selector: 'app-step-categoria',
  templateUrl: './step-categoria.component.html',
  styleUrl: './step-categoria.component.css',
})
export class StepCategoriaComponent implements OnInit, OnChanges {
  @Input() activeStep: number = 0;
  @Input() totalSteps: number = 5;
  @Input() campanha: Campanha | null = null;
  @Output() formUpdate: EventEmitter<FormGroup> = new EventEmitter();
  @Output() onCancel: EventEmitter<void> = new EventEmitter();
  @ViewChild('header', { static: true }) headerTemplate!: TemplateRef<any>;
  @ViewChild('content', { static: true }) contentTemplate!: TemplateRef<any>;

  categoriesFormatted: string = '';
  stepCategoriaForm!: FormGroup;

  private fb = inject(FormBuilder);

  categorysList = [
    { name: 'Alimentação', value: 'Alimentação', selected: false, icon: 'food-apple-outline' },
    { name: 'Saúde', value: 'Saúde', selected: false, icon: 'stethoscope' },
    { name: 'Vestuário', value: 'Vestuário', selected: false, icon: 'tshirt-crew-outline' },
    { name: 'Educação', value: 'Educação', selected: false, icon: 'school-outline' },
    { name: 'Moradia', value: 'Moradia', selected: false, icon: 'home-outline' },
    { name: 'Transporte', value: 'Transporte', selected: false, icon: 'car-outline' },
    { name: 'Trabalho', value: 'Trabalho', selected: false, icon: 'briefcase-outline' },
    { name: 'Dinheiro', value: 'Dinheiro', selected: false, icon: 'cash-register' },
    { name: 'Esporte', value: 'Esporte', selected: false, icon: 'basketball' },
    { name: 'Justiça', value: 'Justiça', selected: false, icon: 'scale-balance' },
    { name: 'Tecnologia', value: 'Tecnologia', selected: false, icon: 'laptop' },
    { name: 'Outros', value: 'Outros', selected: false, icon: 'dots-horizontal-circle-outline' },
  ];

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['campanha'] && this.stepCategoriaForm && this.campanha) {
      this.stepCategoriaForm.patchValue(
        {
          category: this.campanha.category || [],
          categoriesFormatted: this.campanha.categoriesFormatted || '',
        },
        { emitEvent: false }
      );

      this.categorysList.forEach((category) => {
        category.selected = (this.campanha?.category || []).includes(category.value);
      });
    }
  }

  initializeForm(): void {
    this.stepCategoriaForm = this.fb.group({
      category: [this.campanha?.category || [], [Validators.required]],
      categoriesFormatted: [this.campanha?.categoriesFormatted || ''],
    });

    if (this.campanha?.category) {
      this.categorysList.forEach((category) => {
        category.selected = this.campanha?.category?.includes(category.value) || false;
      });
    }

    this.stepCategoriaForm.valueChanges.subscribe(() => {
      this.formUpdate.emit(this.stepCategoriaForm);
    });
  }

  handleCategoriesSelected() {
    const categorys = this.categorysList.filter((c) => c.selected).map((c) => c.value);
    this.categoriesFormatted = categorys.join(', ');

    this.stepCategoriaForm.patchValue({
      category: categorys,
      categoriesFormatted: this.categoriesFormatted,
    });
  }

  get category() {
    return this.stepCategoriaForm.get('category');
  }
}

