import { Component, inject, OnInit } from '@angular/core';
import { Campanha } from '../../../shared/models/campanha.model';
import { AuthUser } from '../../../shared/models/auth';
import { Subject, takeUntil, take } from 'rxjs';
import { AuthService } from '../../../shared/services/auth.service';
import { CampanhaService } from '../../../shared/services/campanha.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { MessageConfirmationService } from '../../../shared/services/message-confirmation.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listagem',
  templateUrl: './listagem.component.html',
  styleUrl: './listagem.component.css',
})
export class ListagemComponent implements OnInit {
  campanhas: Campanha[] = [];
  loading: boolean = false;
  userSession: AuthUser | null = null;
  dialog: 'relatorio' | 'comentarios' | 'deposito' | null = null;
  dialogVisible = false;
  selectedCampanha: Campanha | null = null;

  campanhaService = inject(CampanhaService);
  authService = inject(AuthService);
  loadingService = inject(LoadingService);
  messageConfirmationService = inject(MessageConfirmationService);
  router = inject(Router);

  private destroy$ = new Subject();

  ngOnInit(): void {
    this.userSession = this.authService.getAuthResponse();
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

          this.campanhas = this.campanhas.concat(this.campanhas);
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

  getProgress(campanha: Campanha): number {
    if (!campanha.value_donated) return 0;

    if (campanha.value_required > 0 && campanha.value_donated >= 0) {
      return parseFloat((((campanha.value_donated ?? 0) / campanha.value_required) * 100).toFixed(2));
    }

    return 0;
  }

  onEdit(campanha_id: String) {
    this.router.navigate([`hopeshare/campanha/${campanha_id}`]);
  }

  openDialog(type: 'relatorio' | 'comentarios' | 'deposito', campanha: any) {
    this.dialog = type;
    this.selectedCampanha = campanha;
    this.dialogVisible = true;
  }

  getDialogHeader(): string {
    switch (this.dialog) {
      case 'relatorio':
        return 'Gerar Relatório';
      case 'comentarios':
        return 'Comentários da Campanha';
      case 'deposito':
        return 'Solicitar Depósito';
      default:
        return 'Detalhes';
    }
  }
}

