import { Component, OnDestroy, Input, Output, EventEmitter, inject } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { StatusDenuncia, StatusDenunciaList } from '../../../../../shared/enums/StatusDenuncia.enum';
import { CampanhaService } from '../../../../../shared/services/campanha.service';
import { LoadingService } from '../../../../../shared/services/loading.service';
import { MessageConfirmationService } from '../../../../../shared/services/message-confirmation.service';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AuthUser } from '../../../../../shared/models/auth';
import { DenunciaCampanhaGrouped } from '../../../../../shared/models/campanha.model';
import { Denuncia } from '../../../../../shared/models/denuncia.model';

@Component({
  selector: 'app-denuncias',
  templateUrl: './denuncias.component.html',
  styleUrl: './denuncias.component.css',
})
export class DenunciasComponent implements OnDestroy {
  @Input() userSession: AuthUser | null = null;
  @Input() denunciasGrouped: DenunciaCampanhaGrouped[] = [];
  @Input() loading: boolean = false;
  @Output() refresh = new EventEmitter<void>();

  selectedDenuncia: Denuncia | null = null;
  modalDetalhes = false;
  modalSuspender = false;
  selectedCampanha: DenunciaCampanhaGrouped | null = null;
  suspensaoReason = '';
  searchValue: string = '';

  statusDenunciaList = StatusDenunciaList;

  private destroy$ = new Subject<void>();

  campanhaStatusOptions = [
    { label: 'Todas as Campanhas', value: '' },
    { label: 'Campanhas Ativas', value: 'ACTIVE' },
    { label: 'Campanhas Suspensas', value: 'SUSPENDED' },
  ];

  selectedCampanhaStatus = '';

  private campanhaService = inject(CampanhaService);
  private loadingService = inject(LoadingService);
  private messageService = inject(MessageConfirmationService);
  private router = inject(Router);

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getFilteredCampanhas() {
    let filtered = [...this.denunciasGrouped];

    if (this.selectedCampanhaStatus) {
      filtered = filtered.filter((campanha) => {
        if (this.selectedCampanhaStatus === 'ACTIVE') return !campanha.is_suspended;
        if (this.selectedCampanhaStatus === 'SUSPENDED') return campanha.is_suspended;
        return true;
      });
    }

    if (this.searchValue.trim()) {
      filtered = filtered.filter((campanha) =>
        campanha.campanha_title.toLowerCase().includes(this.searchValue.toLowerCase())
      );
    }

    return filtered;
  }

  toggleCampanhaExpanded(campanha: DenunciaCampanhaGrouped) {
    campanha.expanded = !campanha.expanded;
  }

  getDenunciaActionItems(denuncia: Denuncia): MenuItem[] {
    return this.getActionItems(denuncia);
  }

  viewDetails(denuncia: Denuncia) {
    this.selectedDenuncia = denuncia;
    this.modalDetalhes = true;
  }

  updateStatus(denuncia: Denuncia, newStatus: string) {
    if (!denuncia.report_id) return;

    this.loadingService.start();
    this.campanhaService
      .updateDenunciaStatus(denuncia.report_id, newStatus, this.userSession!.user_id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.messageService.showMessage('Status', 'Status da denúncia atualizado com sucesso!');

          const campanha = this.denunciasGrouped.find((c) => c.campanha_id === denuncia.campanha.campanha_id);
          if (campanha) {
            this.decrementStatusCount(campanha, denuncia.status!);

            this.incrementStatusCount(campanha, newStatus as StatusDenuncia);

            denuncia.status = newStatus as StatusDenuncia;
          }
        },
        error: () => {
          this.messageService.showError('Erro', 'Erro ao atualizar status da denúncia.');
        },
      })
      .add(() => {
        this.loadingService.done();
      });
  }

  getStatusSeverity(status: StatusDenuncia): 'success' | 'warning' | 'danger' | 'info' {
    switch (status) {
      case StatusDenuncia.RESOLVED:
        return 'success';
      case StatusDenuncia.ANALYZED:
        return 'warning';
      case StatusDenuncia.PENDING:
        return 'danger';
      default:
        return 'info';
    }
  }

  getReasonLabel(reason: string): string {
    const reasons: { [key: string]: string } = {
      CONTEUDO_INADEQUADO: 'Conteúdo Inadequado',
      INFORMACOES_FALSAS: 'Informações Falsas',
      SPAM: 'Spam ou Propaganda',
      FRAUDE_FINANCEIRA: 'Fraude Financeira',
      DIREITOS_AUTORAIS: 'Violação de Direitos Autorais',
      OUTROS: 'Outros',
    };
    return reasons[reason] || reason;
  }

  getActionItems(denuncia: Denuncia): MenuItem[] {
    return [
      {
        label: 'Marcar como Analisada',
        icon: 'pi pi-search',
        command: () => this.updateStatus(denuncia, StatusDenuncia.ANALYZED),
        disabled: denuncia.status === StatusDenuncia.ANALYZED,
      },
      {
        label: 'Marcar como Resolvida',
        icon: 'pi pi-check',
        command: () => this.updateStatus(denuncia, StatusDenuncia.RESOLVED),
        disabled: denuncia.status === StatusDenuncia.RESOLVED,
      },
      {
        label: 'Marcar como Pendente',
        icon: 'pi pi-clock',
        command: () => this.updateStatus(denuncia, StatusDenuncia.PENDING),
        disabled: denuncia.status === StatusDenuncia.PENDING,
      },
    ];
  }

  getCampanhaActionItems(campanha: DenunciaCampanhaGrouped): MenuItem[] {
    return [
      {
        label: campanha.is_suspended ? 'Reativar Campanha' : 'Suspender Campanha',
        icon: campanha.is_suspended ? 'pi pi-play' : 'pi pi-ban',
        command: () => (campanha.is_suspended ? this.reactivateCampanha(campanha) : this.openSuspendModal(campanha)),
      },
      {
        label: 'Ver Campanha',
        icon: 'pi pi-external-link',
        command: () => this.viewCampanha(campanha),
      },
    ];
  }

  openSuspendModal(campanha: DenunciaCampanhaGrouped) {
    this.selectedCampanha = campanha;
    this.suspensaoReason = '';
    this.modalSuspender = true;
  }

  reactivateCampanha(campanha: DenunciaCampanhaGrouped) {
    this.campanhaService
      .reactivateCampanha(campanha.campanha_id, this.userSession!.user_id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.messageService.showMessage('Sucesso', 'Campanha reativada com sucesso!');
          campanha.is_suspended = false;
        },
        error: () => {
          this.messageService.showError('Erro', 'Erro ao reativar campanha.');
        },
      })
      .add(() => {
        this.loadingService.done();
      });
  }

  viewCampanha(campanha: DenunciaCampanhaGrouped) {
    this.router.navigate([`hopeshare/campanha/editar/${campanha.campanha_id}`]);
  }

  private decrementStatusCount(campanha: DenunciaCampanhaGrouped, status: StatusDenuncia): void {
    switch (status) {
      case StatusDenuncia.PENDING:
        campanha.denuncias_pendentes = Math.max(0, campanha.denuncias_pendentes - 1);
        break;
      case StatusDenuncia.ANALYZED:
        campanha.denuncias_analisadas = Math.max(0, campanha.denuncias_analisadas - 1);
        break;
      case StatusDenuncia.RESOLVED:
        campanha.denuncias_resolvidas = Math.max(0, campanha.denuncias_resolvidas - 1);
        break;
    }
  }

  private incrementStatusCount(campanha: DenunciaCampanhaGrouped, status: StatusDenuncia): void {
    switch (status) {
      case StatusDenuncia.PENDING:
        campanha.denuncias_pendentes++;
        break;
      case StatusDenuncia.ANALYZED:
        campanha.denuncias_analisadas++;
        break;
      case StatusDenuncia.RESOLVED:
        campanha.denuncias_resolvidas++;
        break;
    }
  }
}

