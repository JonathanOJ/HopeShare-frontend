import { AfterViewInit, Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { Subject, take, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { Campanha } from '../../../shared/models/campanha.model';
import { CampanhaService } from '../../../shared/services/campanha.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { AuthService } from '../../../shared/services/auth.service';
import { AuthUser } from '../../../shared/models/auth';
import { MessageConfirmationService } from '../../../shared/services/message-confirmation.service';

@Component({
  selector: 'app-campanha-listagem',
  templateUrl: './campanha-listagem.component.html',
  styleUrl: './campanha-listagem.component.css',
})
export class CampanhaListagemComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('dt2') dt2: Table | undefined;

  isMobile: boolean = window.innerWidth < 768;
  visible: boolean = false;
  searchValue: string = '';
  campanhas: Campanha[] = [];
  campanha: Campanha | null = null;
  selectedItem: Campanha | null = null;
  userSession: AuthUser | null = null;
  loading: boolean = false;

  categoryOptions = [
    { label: 'Todas as categorias', value: null },
    { label: 'Alimentação', value: 'Alimentação' },
    { label: 'Saúde', value: 'Saúde' },
    { label: 'Vestuário', value: 'Vestuário' },
    { label: 'Educação', value: 'Educação' },
    { label: 'Moradia', value: 'Moradia' },
    { label: 'Transporte', value: 'Transporte' },
    { label: 'Trabalho', value: 'Trabalho' },
    { label: 'Dinheiro', value: 'Dinheiro' },
    { label: 'Esporte', value: 'Esporte' },
    { label: 'Justiça', value: 'Justiça' },
    { label: 'Tecnologia', value: 'Tecnologia' },
    { label: 'Outros', value: 'Outros' },
  ];
  selectedCategory: string | null = null;

  private destroy$ = new Subject();

  private campanhaService = inject(CampanhaService);
  private authService = inject(AuthService);
  private loadingService = inject(LoadingService);
  private router = inject(Router);
  private messageConfirmationService = inject(MessageConfirmationService);

  ngAfterViewInit(): void {
    this.isMobile ? this.router.navigate(['hopeshare/home']) : '';
  }

  ngOnInit(): void {
    const authResponse = this.authService.getAuthResponse();
    authResponse && authResponse ? (this.userSession = authResponse) : this.router.navigate(['/login']);

    this.getCampanhas();
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  getCampanhas() {
    this.loading = true;
    this.loadingService.start();

    this.campanhaService
      .findCampanhaByUser(this.userSession!.user_id)
      .pipe(takeUntil(this.destroy$), take(1))
      .subscribe({
        next: (resp: Campanha[]) => {
          this.campanhas = resp;

          this.campanhas.forEach((campanha) => {
            campanha.progress_percentage = this.getProgress(campanha);
          });
        },
        error: () => {
          this.messageConfirmationService.showError('Erro', 'Erro ao carregar campanhas!');
        },
      })
      .add(() => {
        this.loading = false;
        this.loadingService.done();
      });
  }

  onInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.dt2 ? this.dt2.filterGlobal(inputElement.value || '', 'contains') : '';
  }

  filterByCategory(event: any) {
    const selectedCategory = event.value;
    if (this.dt2) {
      if (selectedCategory) {
        this.dt2.filter(selectedCategory, 'category', 'contains');
      } else {
        this.dt2.filter('', 'category', 'contains');
      }
    }
  }

  clear(table: Table) {
    table.clear();
    this.searchValue = '';
    this.selectedCategory = null;
  }

  handleCreateMode() {
    this.router.navigate(['hopeshare/campanha/cadastro']);
  }

  onEdit(campanha_id: string) {
    this.router.navigate([`hopeshare/campanha/editar/${campanha_id}`]);
  }

  onDelete(id: string) {
    this.loadingService.start();
    this.campanhaService
      .deleteCampanha(id)
      .pipe(takeUntil(this.destroy$), take(1))
      .subscribe({
        next: () => {
          this.campanhas = this.campanhas.filter((h) => h.campanha_id !== id);
          this.messageConfirmationService.showMessage('Sucesso', 'Campanha deletada com sucesso!');
        },
        error: (error: any) => {
          let errorMessage = '';

          error.status == 400 ? (errorMessage = error.error.error) : (errorMessage = 'Erro ao deletar campanha!');
          this.messageConfirmationService.showError('Erro', errorMessage);
        },
      })
      .add(() => {
        this.loadingService.done();
      });
  }

  getProgress(campanha: Campanha): number {
    if (!campanha.value_donated) return 0;

    if (campanha.value_required > 0 && campanha.value_donated >= 0) {
      return parseFloat((((campanha.value_donated ?? 0) / campanha.value_required) * 100).toFixed(2));
    }

    return 0;
  }

  canRequestDeposit(campanha: Campanha): boolean {
    return campanha.status === 'ACTIVE' && campanha.value_donated > 0;
  }

  solicitarDeposito(campanha: Campanha) {
    this.messageConfirmationService.confirmWarning({
      message: `Deseja solicitar o depósito da campanha "${campanha.title}"? 
                Valor disponível: R$ ${campanha.value_donated?.toFixed(2)}
                
                Após aprovação, a campanha será finalizada e não poderá mais receber doações.`,
      accept: () => {
        this.loading = true;
        this.loadingService.start();
        this.campanhaService
          .createSolicitacaoDeposito(campanha.campanha_id, 'Solicitação de depósito da campanha.')
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.messageConfirmationService.showMessage(
                'Sucesso',
                'Solicitação de depósito enviada com sucesso! Aguarde a análise do administrador.'
              );
              this.getCampanhas();
            },
            error: (error) => {
              console.error('Erro ao solicitar depósito:', error);
              let errorMessage = 'Erro ao solicitar depósito.';
              if (error.status === 400) {
                errorMessage = error.error.error || errorMessage;
              }
              this.messageConfirmationService.showError('Erro', errorMessage);
            },
          })
          .add(() => {
            this.loading = false;
            this.loadingService.done();
          });
      },
    });
  }
}

