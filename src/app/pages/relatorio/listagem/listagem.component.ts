import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil, take } from 'rxjs';
import { AuthUser } from '../../../shared/models/auth';
import { Relatorio } from '../../../shared/models/relatorio.model';
import { AuthService } from '../../../shared/services/auth.service';
import { MessageConfirmationService } from '../../../shared/services/message-confirmation.service';
import { RelatorioService } from '../../../shared/services/relatorio.service';

@Component({
  selector: 'app-listagem',
  templateUrl: './listagem.component.html',
  styleUrl: './listagem.component.css',
})
export class ListagemComponent implements OnInit, OnDestroy {
  relatoriosContabeis: Relatorio[] = [];
  relatoriosFinanceiros: Relatorio[] = [];

  userSession: AuthUser | null = null;
  loading: boolean = false;

  private relatorioService = inject(RelatorioService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private messageConfirmationService = inject(MessageConfirmationService);

  private destroy$ = new Subject();

  ngOnInit(): void {
    this.userSession = this.authService.getAuthResponse();
    this.getRelatorios();

    let relfinan = {
      relatorioId: '1SOAUHIOSUAKS',
      description: 'Relatório Financeiro Exemplo',
      type: 'FINANCEIRO',
      created_at: new Date(),
      autor: this.userSession!.username,
      url: 'https://example.com/relatorio-financeiro.pdf',
    } as Relatorio;

    this.relatoriosFinanceiros.push(relfinan);
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  getRelatorios() {
    this.loading = true;

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
      .add(() => (this.loading = false));
  }
}

