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
  selector: 'app-step-categoria',
  templateUrl: './step-categoria.component.html',
  styleUrl: './step-categoria.component.css',
})
export class StepCategoriaComponent implements OnChanges {
  @Input() activeStep: number = 0;
  @Input() totalSteps: number = 5;
  @Input() campanhaForm: FormGroup | null = null;
  @Output() onCancel: EventEmitter<void> = new EventEmitter();
  @ViewChild('header', { static: true }) headerTemplate!: TemplateRef<any>;
  @ViewChild('content', { static: true }) contentTemplate!: TemplateRef<any>;

  categoriesFormatted: string = '';

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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['campanhaForm'] && this.campanhaForm) {
      console.log('Campanha Form mudou:', this.campanhaForm?.get('category')?.value);
      this.categorysList.forEach((category) => {
        category.selected = (this.campanhaForm?.get('category')?.value || []).includes(category.value);
      });
    }
  }

  handleCategoriesSelected() {
    const categorys = this.categorysList.filter((c) => c.selected).map((c) => c.value);
    this.categoriesFormatted = categorys.join(', ');

    this.campanhaForm?.patchValue({
      category: categorys,
      categoriesFormatted: this.categoriesFormatted,
    });
  }

  get category() {
    return this.campanhaForm?.get('category');
  }
}

