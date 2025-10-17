import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Campanha, Endereco } from '../../../shared/models/campanha.model';
import { CampanhaService } from '../../../shared/services/campanha.service';
import { MessageConfirmationService } from '../../../shared/services/message-confirmation.service';
import { Subject, take, takeUntil } from 'rxjs';
import { AuthService } from '../../../shared/services/auth.service';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
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
  stepCategoriaForm!: FormGroup;
  stepDescricaoForm!: FormGroup;
  stepMetaForm!: FormGroup;
  stepEnderecoForm!: FormGroup;

  private campanhaService = inject(CampanhaService);
  private messageConfirmationService = inject(MessageConfirmationService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private loadingService = inject(LoadingService);

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
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  onSave() {
    this.loading = true;
    this.loadingService.start();

    if (this.stepCategoriaForm.invalid || this.stepDescricaoForm.invalid || this.stepMetaForm.invalid) {
      this.messageConfirmationService.showError('Erro', 'Revisar campos obrigatórios!');
      this.loading = false;
      this.loadingService.done();
      return;
    }

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

  getPayloadToSave(): Campanha {
    const payload = {
      campanha_id: this.campanha?.campanha_id || '',
      title: this.stepDescricaoForm.get('title')?.value,
      description: this.stepDescricaoForm.get('description')?.value,
      image: this.stepDescricaoForm.get('image')?.value,
      category: this.stepCategoriaForm.get('category')?.value,
      request_emergency: this.stepDescricaoForm.get('request_emergency')?.getRawValue(),
      value_required: this.stepMetaForm.get('value_required')?.value,
      user_responsable: this.userSession,
      address: {
        street: this.have_address ? this.stepEnderecoForm.get('street')?.value : null,
        number: this.have_address ? this.stepEnderecoForm.get('number')?.value : null,
        complement: this.have_address ? this.stepEnderecoForm.get('complement')?.value : null,
        city: this.have_address ? this.stepEnderecoForm.get('city')?.value : null,
        state: this.have_address ? this.stepEnderecoForm.get('state')?.value : null,
        zipcode: this.have_address ? this.stepEnderecoForm.get('zipcode')?.value : null,
        neighborhood: this.have_address ? this.stepEnderecoForm.get('neighborhood')?.value : null,
      } as Endereco,
      status: this.campanha?.status || StatusCampanha.ACTIVE,
      have_address: this.stepDescricaoForm.get('have_address')?.getRawValue(),
    } as Campanha;

    return payload;
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

  updateForm(type: string, value: FormGroup) {
    switch (type) {
      case 'stepCategoria':
        this.stepCategoriaForm = value;
        this.campanha = {
          ...this.campanha,
          ...this.stepCategoriaForm.value,
        } as Campanha;
        break;

      case 'stepDescricao':
        this.stepDescricaoForm = value;
        this.totalSteps = this.have_address?.value ? 5 : 4;
        this.campanha = {
          ...this.campanha,
          ...this.stepDescricaoForm.value,
        } as Campanha;
        break;

      case 'stepEndereco':
        this.stepEnderecoForm = value;
        const address = {
          ...this.stepEnderecoForm?.value,
        };
        if (this.campanha) {
          this.campanha.address = address as Endereco;
        }

        break;

      case 'stepMeta':
        this.stepMetaForm = value;
        this.campanha = {
          ...this.campanha,
          ...this.stepMetaForm.value,
        } as Campanha;
        break;

      default:
        break;
    }
  }

  get have_address() {
    return this.stepDescricaoForm?.get('have_address');
  }
}

