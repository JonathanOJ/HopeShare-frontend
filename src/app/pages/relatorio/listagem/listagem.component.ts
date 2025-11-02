import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil, take } from 'rxjs';
import { AuthUser } from '../../../shared/models/auth';
import { Relatorio } from '../../../shared/models/relatorio.model';
import { Campanha } from '../../../shared/models/campanha.model';
import { AuthService } from '../../../shared/services/auth.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { MessageConfirmationService } from '../../../shared/services/message-confirmation.service';
import { RelatorioService } from '../../../shared/services/relatorio.service';
import { CampanhaService } from '../../../shared/services/campanha.service';

@Component({
  selector: 'app-listagem',
  templateUrl: './listagem.component.html',
  styleUrl: './listagem.component.css',
})
export class ListagemComponent implements OnInit, OnDestroy {
  relatoriosContabeis: Relatorio[] = [];
  relatoriosFinanceiros: Relatorio[] = [];
  campanhas: Campanha[] = [];
  campanhaSelecionada: Campanha | null = null;

  userSession: AuthUser | null = null;
  loading: boolean = false;
  campanhaIdFromRoute: string | null = null;

  private relatorioService = inject(RelatorioService);
  private authService = inject(AuthService);
  private loadingService = inject(LoadingService);
  private router = inject(Router);
  private campanhaService = inject(CampanhaService);
  private messageConfirmationService = inject(MessageConfirmationService);

  private destroy$ = new Subject();

  ngOnInit(): void {
    this.userSession = this.authService.getAuthResponse();
    this.getRelatorios();

    const urlSegments = this.router.url.split('/');
    this.campanhaIdFromRoute = urlSegments.length > 4 ? urlSegments[4] : null;

    if (this.campanhaIdFromRoute) {
      this.filterCampanhas({ query: this.campanhaIdFromRoute });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  getRelatorios() {
    this.loading = true;
    this.loadingService.start();

    this.relatorioService
      .getRelatoriosByUser(this.userSession!.user_id)
      .pipe(takeUntil(this.destroy$), take(1))
      .subscribe({
        next: (resp: Relatorio[]) => {
          this.relatoriosContabeis = resp.filter((r) => r.type === 'CONTABIL');
          this.relatoriosFinanceiros = resp.filter((r) => r.type === 'FINANCEIRO');
        },
        error: () => {
          this.messageConfirmationService.showError('Erro', 'Erro ao carregar relatórios!');
        },
      })
      .add(() => {
        this.loading = false;
        this.loadingService.done();
      });
  }

  gerarRelatorio(type: 'CONTABIL' | 'FINANCEIRO') {
    if (!this.campanhaSelecionada) {
      this.messageConfirmationService.showMessage('Atenção', 'Selecione uma campanha para poder gerar o relatório.');
      return;
    }

    this.loadingService.start();
    this.relatorioService
      .gerarRelatorioFinanceiro(this.campanhaSelecionada.campanha_id, type)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          type === 'CONTABIL' ? this.relatoriosContabeis.push(response) : this.relatoriosFinanceiros.push(response);

          window.open(response.file_url, '_blank');
          this.messageConfirmationService.showMessage('Sucesso', 'Relatório gerado com sucesso!');
        },
        error: (error) => {
          const errorMessage = error?.error.error || 'Erro ao gerar relatório.';
          this.messageConfirmationService.showError('Erro', errorMessage);
        },
      })
      .add(() => {
        this.loadingService.done();
      });
  }

  deleteRelatorio(relatorio: Relatorio) {
    this.loadingService.start();
    this.relatorioService
      .deleteRelatorio(relatorio.financial_report_id!)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.getRelatorios();
          this.messageConfirmationService.showMessage('Sucesso', 'Relatório deletado com sucesso!');
        },
        error: (error) => {
          const errorMessage = error?.error.error || 'Erro ao deletar relatório.';
          this.messageConfirmationService.showError('Erro', errorMessage);
        },
      })
      .add(() => {
        this.loadingService.done();
      });
  }

  filterCampanhas(event: any) {
    const query = event.query.toLowerCase();

    const body = {
      search: query,
      category: 'Todos',
      page: 1,
      itemsPerPage: 10,
      user_id: this.userSession!.user_id,
    };

    this.campanhaService
      .searchCampanha(body)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.campanhas = response.Items;
          if (this.campanhaIdFromRoute) {
            this.campanhaSelecionada = this.campanhas.find((c) => c.campanha_id === this.campanhaIdFromRoute) || null;
          }
        },
        error: (error) => {
          const errorMessage = error?.error.error || 'Erro ao buscar campanhas.';
          this.messageConfirmationService.showError('Erro', errorMessage);
        },
      });
  }
}

