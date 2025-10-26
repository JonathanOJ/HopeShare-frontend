import { Component, inject, OnInit } from '@angular/core';
import { Campanha } from '../../../shared/models/campanha.model';
import { AuthUser, TipoUsuario } from '../../../shared/models/auth';
import { Subject, takeUntil, take } from 'rxjs';
import { AuthService } from '../../../shared/services/auth.service';
import { CampanhaService } from '../../../shared/services/campanha.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { MessageConfirmationService } from '../../../shared/services/message-confirmation.service';
import { Router } from '@angular/router';
import { StatusCampanha } from '../../../shared/enums/StatusCampanha.enum';
import { CreateSolicitacaoDepositoRequest } from '../../../shared/models/solicitacao-deposito.model';
import { MenuItem } from 'primeng/api';

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

  isMobile: boolean = window.innerWidth < 768;

  actionsMenuItems: MenuItem[] = [
    {
      label: 'Editar',
      icon: 'pi pi-pencil',
      command: () => this.onEdit(this.selectedCampanha!.campanha_id),
    },
    {
      separator: true,
    },
    {
      label: 'Comentários',
      icon: 'pi pi-comment',
      command: () => this.openDialog('comentarios'),
    },
    {
      label: 'Relatório',
      icon: 'pi pi-file',
      command: () => this.redirectToRelatorios(),
    },
    {
      separator: true,
    },
    {
      label: 'Solicitar Depósito',
      icon: 'pi pi-wallet',
      command: () => this.openDialog('deposito'),
      styleClass: 'text-green-600',
    },
  ];

  animatedTotalArrecadado: number = 0;
  private animationDuration = 2000;

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
      .findCampanhaByUser(this.userSession!.user_id, true)
      .pipe(takeUntil(this.destroy$), take(1))
      .subscribe({
        next: (resp: Campanha[]) => {
          this.campanhas = resp;

          this.campanhas.forEach((campanha) => {
            campanha.progress_percentage = this.getProgress(campanha);
          });

          this.animateCounter();
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
    this.router.navigate([`hopeshare/campanha/editar/${campanha_id}`]);
  }

  openDialog(type: 'comentarios' | 'deposito') {
    this.dialog = type;
    this.dialogVisible = true;
  }

  getDialogHeader(): string {
    switch (this.dialog) {
      case 'comentarios':
        return 'Comentários da Campanha';
      case 'deposito':
        return 'Solicitar Depósito';
      default:
        return 'Detalhes';
    }
  }

  getTotalArrecadado(): number {
    return this.campanhas.reduce((total, campanha) => {
      return total + (campanha.value_donated || 0);
    }, 0);
  }

  getMetaTotal(): number {
    return this.campanhas.reduce((total, campanha) => {
      return total + (campanha.value_required || 0);
    }, 0);
  }

  getPercentualTotal(): number {
    const totalArrecadado = this.getTotalArrecadado();
    const metaTotal = this.getMetaTotal();

    if (metaTotal > 0) {
      return parseFloat(((totalArrecadado / metaTotal) * 100).toFixed(1));
    }
    return 0;
  }

  getCampanhasFinalizadas(): number {
    return this.campanhas.filter((campanha) => {
      return (campanha.progress_percentage || 0) >= 100;
    }).length;
  }

  animateCounter(): void {
    const targetValue = this.getTotalArrecadado();
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / this.animationDuration, 1);

      const easeOutQuart = 1 - Math.pow(1 - progress, 4);

      this.animatedTotalArrecadado = Math.floor(targetValue * easeOutQuart);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.animatedTotalArrecadado = targetValue;
      }
    };

    requestAnimationFrame(animate);
  }

  navigateToCreate() {
    this.router.navigate([`hopeshare/campanha/cadastro`]);
  }

  formatCommentDate(date: Date | string): string {
    if (!date) return '';

    const commentDate = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInMs = now.getTime() - commentDate.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) {
      return 'agora';
    } else if (diffInMinutes < 60) {
      return `há ${diffInMinutes} minuto${diffInMinutes > 1 ? 's' : ''}`;
    } else if (diffInHours < 24) {
      return `há ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    } else if (diffInDays < 7) {
      return `há ${diffInDays} dia${diffInDays > 1 ? 's' : ''}`;
    } else {
      return commentDate.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    }
  }

  createSolicitacaoDeposito(): void {
    if (!this.selectedCampanha) return;

    if (this.selectedCampanha.status !== StatusCampanha.ACTIVE) {
      this.messageConfirmationService.showError('Erro', 'Somente campanhas ativas podem solicitar depósito.');
      return;
    }

    if (this.selectedCampanha.value_donated! <= 0) {
      this.messageConfirmationService.showError('Erro', 'Campanhas sem arrecadação não podem solicitar depósito.');
      return;
    }

    this.loading = true;
    this.loadingService.start();

    const payload: CreateSolicitacaoDepositoRequest = {
      campanha: this.selectedCampanha,
      user: this.userSession!,
    };

    this.campanhaService
      .createSolicitacaoDeposito(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.messageConfirmationService.showMessage(
            'Sucesso',
            'Solicitação de depósito enviada com sucesso! Aguarde a análise do administrador.'
          );
          this.dialogVisible = false;
        },
        error: (error) => {
          console.error('Erro ao solicitar depósito:', error);
          const errorMessage = error.error.error || 'Erro ao solicitar depósito.';
          this.messageConfirmationService.showError('Erro', errorMessage);
        },
      })
      .add(() => {
        this.loading = false;
        this.loadingService.done();
      });
  }

  redirectToRelatorios(): void {
    this.router.navigate([`hopeshare/dashboard/relatorios/${this.selectedCampanha?.campanha_id}`]);
  }
}

