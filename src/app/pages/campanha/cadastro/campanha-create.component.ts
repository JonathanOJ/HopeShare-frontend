import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Campanha, Endereco } from '../../../shared/models/campanha.model';
import { CampanhaService } from '../../../shared/services/campanha.service';
import { MessageConfirmationService } from '../../../shared/services/message-confirmation.service';
import { Subject, take, takeUntil } from 'rxjs';
import { AuthService } from '../../../shared/services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthUser } from '../../../shared/models/auth';
import { LoadingService } from '../../../shared/services/loading.service';
import { StatusCampanha } from '../../../shared/enums/StatusCampanha.enum';

@Component({
  selector: 'app-campanha-create',
  templateUrl: './campanha-create.component.html',
  styleUrl: './campanha-create.component.css',
})
export class CampanhaCreateComponent implements OnDestroy, OnInit {
  campanha: Campanha | null = null;
  activeStep: number = 0;
  totalSteps: number = 5;
  loading: boolean = false;
  reload: boolean = false;

  campanhaForm!: FormGroup;

  private campanhaService = inject(CampanhaService);
  private messageConfirmationService = inject(MessageConfirmationService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private loadingService = inject(LoadingService);
  private fb = inject(FormBuilder);

  userSession: AuthUser | null = this.authService.getAuthResponse();

  private destroy$ = new Subject();

  ngOnInit(): void {
    const currentUrl = this.router.url;
    if (currentUrl.includes('/campanha/editar')) {
      const id = currentUrl.split('/').pop();
      if (id) {
        this.onEdit(id);
      } else {
        this.messageConfirmationService.showError('Erro', 'ID da campanha não encontrado!');
        this.router.navigate(['hopeshare/campanha/listagem']);
      }
    } else {
      this.initializeForm();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  initializeForm(campanha: Campanha | null = null): void {
    this.campanhaForm = this.fb.group({
      campanha_id: [campanha?.campanha_id || ''],

      // Descrição
      title: [campanha?.title || '', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: [
        campanha?.description || '',
        [Validators.required, Validators.minLength(10), Validators.maxLength(500)],
      ],
      new_file_image: [null],
      request_emergency: [campanha?.request_emergency || false],
      have_address: [campanha?.have_address || false],
      image: [campanha?.image || null],

      // Endereço
      zipcode: [campanha?.address.zipcode || '', [Validators.required, Validators.pattern(/^\d{5}-\d{3}$/)]],
      street: [
        campanha?.address.street || '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(100)],
      ],
      number: [
        campanha?.address.number || '',
        [Validators.required, Validators.minLength(1), Validators.maxLength(10)],
      ],
      complement: [campanha?.address.complement || '', [Validators.maxLength(50)]],
      neighborhood: [
        campanha?.address.neighborhood || '',
        [Validators.required, Validators.minLength(2), Validators.maxLength(50)],
      ],
      city: [campanha?.address.city || '', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      state: [campanha?.address.state || '', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],

      // Categoria
      category: [campanha?.category || [], [Validators.required]],
      categoriesFormatted: '',

      // Meta
      value_required: [campanha?.value_required || null, Validators.required],
      custom_value: [null, [Validators.min(1)]],
    });
  }

  onSave() {
    this.loading = true;
    this.loadingService.start();

    const payload = this.getPayloadToSave();

    this.campanhaService
      .saveCampanha(payload)
      .pipe(takeUntil(this.destroy$), take(1))
      .subscribe({
        next: (resp: any) => {
          this.campanha = null;
          this.router.navigate(['hopeshare/campanha/listagem']);
          this.messageConfirmationService.showMessage('Sucesso', 'Campanha salva com sucesso!');
        },
        error: () => {
          this.messageConfirmationService.showError('Erro', 'Erro ao salvar campanha!');
        },
      })
      .add(() => {
        this.loading = false;
        this.loadingService.done();
      });
  }

  getPayloadToSave(): FormData {
    const formData = new FormData();

    formData.append('campanha_id', this.campanha?.campanha_id || '');
    formData.append('title', this.title?.value || '');
    formData.append('description', this.description?.value || '');
    formData.append('request_emergency', this.request_emergency?.getRawValue());
    formData.append('have_address', this.have_address?.getRawValue());
    formData.append('value_required', this.value_required?.value || '0');
    formData.append('status', this.campanha?.status || StatusCampanha.ACTIVE);

    const safeUser = {
      user_id: this.userSession?.user_id,
      username: this.userSession?.username,
      email: this.userSession?.email,
    };

    formData.append('user_responsable', JSON.stringify(safeUser));
    formData.append('image', this.campanha?.image ? JSON.stringify(this.campanha?.image) : '');

    const newFile = this.new_file_image?.value;
    if (newFile) {
      formData.append('new_file_image', newFile, newFile.name);
    }

    formData.append('category', JSON.stringify(this.category?.value));

    if (this.have_address?.value) {
      const address = {
        street: this.street?.value || null,
        number: this.number?.value || null,
        complement: this.complement?.value || null,
        city: this.city?.value || null,
        state: this.state?.value || null,
        zipcode: this.zipcode?.value || null,
        neighborhood: this.neighborhood?.value || null,
      };
      formData.append('address', JSON.stringify(address));
    } else {
      formData.append('address', JSON.stringify(null));
    }

    return formData;
  }

  onEdit(id: string) {
    this.loadingService.start();
    this.campanhaService
      .findCampanhaById(id)
      .pipe(takeUntil(this.destroy$), take(1))
      .subscribe({
        next: (resp: any) => {
          this.campanha = resp;

          if (this.campanha) {
            this.campanha.categoriesFormatted = this.campanha?.category ? this.campanha.category.join(', ') : '';
            this.totalSteps = this.campanha.have_address ? 5 : 4;
            this.haveAddressChange();

            this.initializeForm(this.campanha);
          }
        },
        error: () => {
          this.messageConfirmationService.showError('Erro', 'Erro ao carregar campanha!');
          this.router.navigate(['hopeshare/campanha/listagem']);
        },
      })
      .add(() => {
        this.loadingService.done();
      });
  }

  onCancel() {
    const msgComplement = this.campanha?.campanha_id ? 'a edição da campanha' : 'a criação da campanha';
    this.messageConfirmationService.confirmWarning({
      message: `Você realmente deseja cancelar ${msgComplement}?`,
      acceptLabel: 'Sim, cancelar',
      accept: () => {
        this.campanha = null;
        this.router.navigate(['hopeshare/campanha']);
      },
    });
  }

  haveAddressChange() {
    this.reload = true;
    this.cdr.detectChanges();
    this.reload = false;
  }

  get title() {
    return this.campanhaForm?.get('title');
  }

  get description() {
    return this.campanhaForm?.get('description');
  }

  get request_emergency() {
    return this.campanhaForm?.get('request_emergency');
  }

  get have_address() {
    return this.campanhaForm?.get('have_address');
  }

  get new_file_image() {
    return this.campanhaForm?.get('new_file_image');
  }

  get value_required() {
    return this.campanhaForm?.get('value_required');
  }

  get category() {
    return this.campanhaForm?.get('category');
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
}

