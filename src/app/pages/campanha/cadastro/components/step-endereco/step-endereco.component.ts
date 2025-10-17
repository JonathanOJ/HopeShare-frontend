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
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Campanha } from '../../../../../shared/models/campanha.model';
import { MessageConfirmationService } from '../../../../../shared/services/message-confirmation.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-step-endereco',
  templateUrl: './step-endereco.component.html',
  styleUrl: './step-endereco.component.css',
})
export class StepEnderecoComponent implements OnInit, OnChanges {
  @Input() activeStep: number = 0;
  @Input() totalSteps: number = 5;
  @Input() campanha: Campanha | null = null;
  @Output() onCancel: EventEmitter<void> = new EventEmitter();
  @Output() formUpdate: EventEmitter<FormGroup> = new EventEmitter();
  @ViewChild('header', { static: true }) headerTemplate!: TemplateRef<any>;
  @ViewChild('content', { static: true }) contentTemplate!: TemplateRef<any>;

  stepEnderecoForm!: FormGroup;
  mapUrl: SafeResourceUrl | null = null;

  private fb = inject(FormBuilder);
  private sanitizer = inject(DomSanitizer);
  private messageService = inject(MessageConfirmationService);

  ngOnInit(): void {
    if (!this.stepEnderecoForm) {
      this.initializeForm();
    }
  }

  initializeForm() {
    this.stepEnderecoForm = this.fb.group({
      zipcode: ['', [Validators.required, Validators.pattern(/^\d{5}-\d{3}$/)]],
      street: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      number: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(10)]],
      complement: ['', [Validators.maxLength(50)]],
      neighborhood: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      city: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      state: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    });

    this.stepEnderecoForm.valueChanges.subscribe(() => {
      this.formUpdate.emit(this.stepEnderecoForm);
    });

    this.stepEnderecoForm
      .get('zipcode')
      ?.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((cep) => {
        if (cep && cep.length === 9) {
          this.searchAddressByCep(cep);
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['campanha'] && this.campanha && this.stepEnderecoForm) {
      if (this.stepEnderecoForm.pristine) {
        this.stepEnderecoForm.patchValue(
          {
            street: this.campanha.address.street || '',
            number: this.campanha.address.number || '',
            complement: this.campanha.address.complement || '',
            city: this.campanha.address.city || '',
            state: this.campanha.address.state || '',
            zipcode: this.campanha.address.zipcode || '',
            neighborhood: this.campanha.address.neighborhood || '',
          },
          { emitEvent: false }
        );
      }
    }
  }

  onUpload(event: any) {
    this.stepEnderecoForm.get('image')?.setValue(event.files[0]);
  }

  get street() {
    return this.stepEnderecoForm.get('street');
  }

  get number() {
    return this.stepEnderecoForm.get('number');
  }

  get complement() {
    return this.stepEnderecoForm.get('complement');
  }

  get city() {
    return this.stepEnderecoForm.get('city');
  }

  get state() {
    return this.stepEnderecoForm.get('state');
  }

  get zipcode() {
    return this.stepEnderecoForm.get('zipcode');
  }

  get neighborhood() {
    return this.stepEnderecoForm.get('neighborhood');
  }

  async searchAddressByCep(cep: string): Promise<void> {
    try {
      const cleanCep = cep.replace(/\D/g, '');

      if (cleanCep.length !== 8) return;

      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();

      if (data.erro) {
        this.messageService.showWarning('Atenção', 'CEP não encontrado');
        return;
      }

      this.stepEnderecoForm.patchValue({
        street: data.logradouro || '',
        neighborhood: data.bairro || '',
        city: data.localidade || '',
        state: data.uf || '',
      });

      this.updateMap();
    } catch (error) {
      this.messageService.showError('Erro ao buscar CEP:', 'Erro ao buscar CEP');
    }
  }

  updateMap(): void {
    const formValue = this.stepEnderecoForm.value;

    const addressParts = [
      formValue.street,
      formValue.number,
      formValue.neighborhood,
      formValue.city,
      formValue.state,
      formValue.zipcode,
    ].filter((part) => part && part.toString().trim());

    if (addressParts.length >= 3) {
      const address = addressParts.join(', ');
      const url = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
      this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    } else {
      this.mapUrl = null;
    }
  }

  getGoogleMapsLink(): string {
    const formValue = this.stepEnderecoForm.value;

    const addressParts = [
      formValue.street,
      formValue.number,
      formValue.neighborhood,
      formValue.city,
      formValue.state,
      formValue.zipcode,
    ].filter((part) => part && part.toString().trim());

    if (addressParts.length === 0) return '';

    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressParts.join(', '))}`;
  }
}

