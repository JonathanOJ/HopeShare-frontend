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
  selector: 'app-step-descricao',
  templateUrl: './step-descricao.component.html',
  styleUrl: './step-descricao.component.css',
})
export class StepDescricaoComponent implements OnInit, OnChanges {
  @Input() activeStep: number = 0;
  @Input() totalSteps: number = 5;
  @Input() campanha: Campanha | null = null;
  @Output() haveAddressChange: EventEmitter<void> = new EventEmitter();
  @Output() onCancel: EventEmitter<void> = new EventEmitter();
  @Output() formUpdate: EventEmitter<FormGroup> = new EventEmitter();
  @ViewChild('header', { static: true }) headerTemplate!: TemplateRef<any>;
  @ViewChild('content', { static: true }) contentTemplate!: TemplateRef<any>;

  stepDescricaoForm!: FormGroup;
  private fb = inject(FormBuilder);

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['campanha'] && this.stepDescricaoForm && this.campanha) {
      this.stepDescricaoForm.patchValue(
        {
          title: this.campanha.title || '',
          description: this.campanha.description || '',
          image: this.campanha.image || '',
          request_emergency: this.campanha.request_emergency || false,
          have_address: this.campanha.have_address || false,
        },
        { emitEvent: false }
      );
    }
  }

  initializeForm(): void {
    this.stepDescricaoForm = this.fb.group({
      title: [this.campanha?.title || '', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: [
        this.campanha?.description || '',
        [Validators.required, Validators.minLength(10), Validators.maxLength(500)],
      ],
      image: [this.campanha?.image || ''],
      request_emergency: [this.campanha?.request_emergency || false],
      have_address: [this.campanha?.have_address || false],
    });

    this.stepDescricaoForm.valueChanges.subscribe(() => {
      this.formUpdate.emit(this.stepDescricaoForm);
    });
  }

  onUpload(event: any) {
    this.image?.setValue(event.files[0]);
  }

  handleHaveAddressChange() {
    this.haveAddressChange.emit();
  }

  get description() {
    return this.stepDescricaoForm.get('description');
  }

  get title() {
    return this.stepDescricaoForm.get('title');
  }

  get image() {
    return this.stepDescricaoForm.get('image');
  }

  get request_emergency() {
    return this.stepDescricaoForm.get('request_emergency');
  }

  get have_address() {
    return this.stepDescricaoForm.get('have_address');
  }
}

