import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { StatusDenuncia } from '../../../../../shared/enums/StatusDenuncia.enum';
import { Denuncia } from '../../../../../shared/models/denuncia.model';
import { CampanhaService } from '../../../../../shared/services/campanha.service';
import { LoadingService } from '../../../../../shared/services/loading.service';
import { MessageConfirmationService } from '../../../../../shared/services/message-confirmation.service';

interface DenunciaExtended extends Denuncia {
  campanha_title?: string;
  user_name?: string;
}

interface CampanhaGrouped {
  campanha_id: string;
  campanha_title: string;
  is_suspended?: boolean;
  total_denuncias: number;
  denuncias_pendentes: number;
  denuncias_analisadas: number;
  denuncias_resolvidas: number;
  denuncias: DenunciaExtended[];
  expanded?: boolean;
}

@Component({
  selector: 'app-denuncias',
  templateUrl: './denuncias.component.html',
  styleUrl: './denuncias.component.css',
})
export class DenunciasComponent implements OnInit, OnDestroy, OnChanges {
  @Input() denuncias: DenunciaExtended[] = [];
  @Input() loading: boolean = false;
  @Output() refresh = new EventEmitter<void>();

  campanhasGrouped: CampanhaGrouped[] = [];
  selectedDenuncia: DenunciaExtended | null = null;
  modalDetalhes = false;
  modalSuspender = false;
  selectedCampanha: CampanhaGrouped | null = null;
  suspensaoReason = '';

  private destroy$ = new Subject<void>();

  statusOptions = [
    { label: 'Todas', value: '' },
    { label: 'Pendentes', value: StatusDenuncia.PENDING },
    { label: 'Analisadas', value: StatusDenuncia.ANALYZED },
    { label: 'Resolvidas', value: StatusDenuncia.RESOLVED },
  ];

  campanhaStatusOptions = [
    { label: 'Todas as Campanhas', value: '' },
    { label: 'Campanhas Ativas', value: 'ACTIVE' },
    { label: 'Campanhas Suspensas', value: 'SUSPENDED' },
  ];

  selectedStatus = '';
  selectedCampanhaStatus = '';

  constructor(
    private campanhaService: CampanhaService,
    private loadingService: LoadingService,
    private messageService: MessageConfirmationService
  ) {}

  ngOnInit() {
    this.processarDenuncias();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['denuncias']) {
      this.processarDenuncias();
    }
  }

  processarDenuncias() {
    if (this.denuncias?.length) {
      this.groupDenunciasByCampanha();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  groupDenunciasByCampanha() {
    const campanhasMap = new Map<string, CampanhaGrouped>();

    this.denuncias.forEach((denuncia) => {
      if (!denuncia.campanha_id || !denuncia.campanha_title) return;

      if (!campanhasMap.has(denuncia.campanha_id)) {
        campanhasMap.set(denuncia.campanha_id, {
          campanha_id: denuncia.campanha_id,
          campanha_title: denuncia.campanha_title,
          is_suspended: false, // TODO: obter do backend
          total_denuncias: 0,
          denuncias_pendentes: 0,
          denuncias_analisadas: 0,
          denuncias_resolvidas: 0,
          denuncias: [],
          expanded: false,
        });
      }

      const campanha = campanhasMap.get(denuncia.campanha_id)!;
      campanha.denuncias.push(denuncia);
      campanha.total_denuncias++;

      switch (denuncia.status) {
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
    });

    this.campanhasGrouped = Array.from(campanhasMap.values()).sort((a, b) =>
      a.campanha_title.localeCompare(b.campanha_title)
    );
  }

  getFilteredCampanhas() {
    let filtered = [...this.campanhasGrouped];

    if (this.selectedCampanhaStatus) {
      filtered = filtered.filter((campanha) => {
        if (this.selectedCampanhaStatus === 'ACTIVE') return !campanha.is_suspended;
        if (this.selectedCampanhaStatus === 'SUSPENDED') return campanha.is_suspended;
        return true;
      });
    }

    if (this.selectedStatus) {
      filtered = filtered.filter((campanha) => campanha.denuncias.some((d) => d.status === this.selectedStatus));
    }

    return filtered;
  }

  toggleCampanhaExpanded(campanha: CampanhaGrouped) {
    campanha.expanded = !campanha.expanded;
  }

  getDenunciaActionItems(denuncia: DenunciaExtended): MenuItem[] {
    return this.getActionItems(denuncia);
  }

  viewDetails(denuncia: DenunciaExtended) {
    this.selectedDenuncia = denuncia;
    this.modalDetalhes = true;
  }

  updateStatus(denuncia: DenunciaExtended, newStatus: string) {
    if (!denuncia.report_id) return;

    // Update local state immediately
    denuncia.status = newStatus as any;
    this.groupDenunciasByCampanha(); // Refresh grouping

    this.messageService.showMessage('Status', 'Status da denúncia atualizado com sucesso!');

    // In real implementation, would call backend here:
    // this.campanhaService.updateDenunciaStatus(denuncia.id, newStatus)
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

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('pt-BR');
  }

  getActionItems(denuncia: DenunciaExtended): MenuItem[] {
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

  getCampanhaActionItems(campanha: CampanhaGrouped): MenuItem[] {
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

  openSuspendModal(campanha: CampanhaGrouped) {
    this.selectedCampanha = campanha;
    this.suspensaoReason = '';
    this.modalSuspender = true;
  }

  suspendCampanha() {
    if (!this.selectedCampanha || !this.suspensaoReason.trim()) {
      this.messageService.showWarning('Atenção', 'Por favor, informe o motivo da suspensão.');
      return;
    }

    // Update local state
    this.selectedCampanha.is_suspended = true;
    this.modalSuspender = false;
    this.messageService.showMessage('Sucesso', 'Campanha suspensa com sucesso!');

    // In real implementation, would call backend here:
    // this.campanhaService.suspendCampanha(this.selectedCampanha.campanha_id, this.suspensaoReason)
  }

  reactivateCampanha(campanha: CampanhaGrouped) {
    campanha.is_suspended = false;
    this.messageService.showMessage('Sucesso', 'Campanha reativada com sucesso!');

    // In real implementation, would call backend here:
    // this.campanhaService.reactivateCampanha(campanha.campanha_id)
  }

  viewCampanha(campanha: CampanhaGrouped) {
    window.open(`/campanha/${campanha.campanha_id}`, '_blank');
  }
}

