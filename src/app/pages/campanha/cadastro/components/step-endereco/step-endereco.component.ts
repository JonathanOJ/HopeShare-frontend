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
      address_zipcode: ['', [Validators.required, Validators.pattern(/^\d{5}-\d{3}$/)]],
      address_street: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      address_number: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(10)]],
      address_complement: ['', [Validators.maxLength(50)]],
      address_neighborhood: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      address_city: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      address_state: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    });

    this.stepEnderecoForm.valueChanges.subscribe(() => {
      this.formUpdate.emit(this.stepEnderecoForm);
    });

    this.stepEnderecoForm.get('address_zipcode')?.valueChanges.subscribe((cep) => {
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
            address_street: this.campanha.address_street || '',
            address_number: this.campanha.address_number || '',
            address_complement: this.campanha.address_complement || '',
            address_city: this.campanha.address_city || '',
            address_state: this.campanha.address_state || '',
            address_zipcode: this.campanha.address_zipcode || '',
            address_neighborhood: this.campanha.address_neighborhood || '',
          },
          { emitEvent: false }
        );
      }
    }
  }

  onUpload(event: any) {
    this.stepEnderecoForm.get('image')?.setValue(event.files[0]);
  }

  get address_street() {
    return this.stepEnderecoForm.get('address_street');
  }

  get address_number() {
    return this.stepEnderecoForm.get('address_number');
  }

  get address_complement() {
    return this.stepEnderecoForm.get('address_complement');
  }

  get address_city() {
    return this.stepEnderecoForm.get('address_city');
  }

  get address_state() {
    return this.stepEnderecoForm.get('address_state');
  }

  get address_zipcode() {
    return this.stepEnderecoForm.get('address_zipcode');
  }

  get address_neighborhood() {
    return this.stepEnderecoForm.get('address_neighborhood');
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
        address_street: data.logradouro || '',
        address_neighborhood: data.bairro || '',
        address_city: data.localidade || '',
        address_state: data.uf || '',
      });

      this.updateMap();
    } catch (error) {
      this.messageService.showError('Erro ao buscar CEP:', 'Erro ao buscar CEP');
    }
  }

  updateMap(): void {
    const formValue = this.stepEnderecoForm.value;

    const addressParts = [
      formValue.address_street,
      formValue.address_number,
      formValue.address_neighborhood,
      formValue.address_city,
      formValue.address_state,
      formValue.address_zipcode,
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
      formValue.address_street,
      formValue.address_number,
      formValue.address_neighborhood,
      formValue.address_city,
      formValue.address_state,
      formValue.address_zipcode,
    ].filter((part) => part && part.toString().trim());

    if (addressParts.length === 0) return '';

    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressParts.join(', '))}`;
  }
}

