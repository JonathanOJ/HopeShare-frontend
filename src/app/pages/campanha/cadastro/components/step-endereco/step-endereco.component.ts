import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MessageConfirmationService } from '../../../../../shared/services/message-confirmation.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-step-endereco',
  templateUrl: './step-endereco.component.html',
  styleUrl: './step-endereco.component.css',
})
export class StepEnderecoComponent implements OnChanges {
  @Input() activeStep: number = 0;
  @Input() totalSteps: number = 5;
  @Input() campanhaForm: FormGroup | null = null;
  @Output() onCancel: EventEmitter<void> = new EventEmitter();
  @ViewChild('header', { static: true }) headerTemplate!: TemplateRef<any>;
  @ViewChild('content', { static: true }) contentTemplate!: TemplateRef<any>;

  mapUrl: SafeResourceUrl | null = null;

  private sanitizer = inject(DomSanitizer);
  private messageService = inject(MessageConfirmationService);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['campanhaForm'] && this.campanhaForm) {
      this.campanhaForm
        .get('zipcode')
        ?.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
        .subscribe((cep) => {
          if (cep && cep.length === 9) {
            this.searchAddressByCep(cep);
          }
        });

      this.updateMap();
    }
  }

  onUpload(event: any) {
    this.campanhaForm?.get('image')?.setValue(event.files[0]);
  }

  get street() {
    return this.campanhaForm?.get('street');
  }

  get number() {
    return this.campanhaForm?.get('number');
  }

  get complement() {
    return this.campanhaForm?.get('complement');
  }

  get city() {
    return this.campanhaForm?.get('city');
  }

  get state() {
    return this.campanhaForm?.get('state');
  }

  get zipcode() {
    return this.campanhaForm?.get('zipcode');
  }

  get neighborhood() {
    return this.campanhaForm?.get('neighborhood');
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

      this.campanhaForm?.patchValue({
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
    const formValue = this.campanhaForm?.value;

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
    const formValue = this.campanhaForm?.value;

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

  validateStepEndereco(): boolean {
    if (!this.campanhaForm) return true;

    const requiredFields = ['zipcode', 'street', 'number', 'neighborhood', 'city', 'state'];

    for (const field of requiredFields) {
      const control = this.campanhaForm.get(field);
      if (!control || control.invalid) {
        return true;
      }
    }

    return false;
  }
}

