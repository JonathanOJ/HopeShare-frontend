import { Component, OnInit, OnDestroy } from '@angular/core';
import { CampanhaService } from '../../../shared/services/campanha.service';
import { Denuncia } from '../../../shared/models/denuncia.model';
import { MenuItem } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { MessageConfirmationService } from '../../../shared/services/message-confirmation.service';
import { StatusDenuncia } from '../../../shared/enums/StatusDenuncia.enum';

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
export class DenunciasComponent implements OnInit, OnDestroy {
  denuncias: DenunciaExtended[] = [];
  campanhasGrouped: CampanhaGrouped[] = [];
  loading = false;
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
    private messageService: MessageConfirmationService
  ) {}

  ngOnInit() {
    this.loadDenuncias();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDenuncias() {
    // this.loading = true;
    // this.campanhaService
    //   .getDenuncias()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe({
    //     next: (denuncias) => {
    //       this.denuncias = denuncias;
    //       this.groupDenunciasByCampanha();
    //       this.loading = false;
    //     },
    //     error: (error) => {
    //       console.error('Erro ao carregar denúncias:', error);
    //       this.messageService.showError('Erro', 'Erro ao carregar denúncias. Tente novamente.');
    //       this.loading = false;

    // Dados de exemplo em caso de erro
    this.denuncias = [
      {
        id: '1',
        reason: 'CONTEUDO_INADEQUADO',
        description: 'Campanha contém conteúdo ofensivo',
        status: StatusDenuncia.PENDING,
        created_at: new Date(),
        user_id: 'user1',
        campanha_id: 'camp1',
        campanha_title: 'Ajuda para medicamentos',
        user_name: 'João Silva',
      },
      {
        id: '1',
        reason: 'CONTEUDO_INADEQUADO',
        description: 'Campanha contém conteúdo ofensivo',
        status: StatusDenuncia.PENDING,
        created_at: new Date(),
        user_id: 'user1',
        campanha_id: 'camp1',
        campanha_title: 'Ajuda para medicamentos',
        user_name: 'João Silva',
      },
      {
        id: '1',
        reason: 'CONTEUDO_INADEQUADO',
        description: 'Campanha contém conteúdo ofensivo',
        status: StatusDenuncia.PENDING,
        created_at: new Date(),
        user_id: 'user1',
        campanha_id: 'camp1',
        campanha_title: 'Ajuda para medicamentos',
        user_name: 'João Silva',
      },
      {
        id: '1',
        reason: 'CONTEUDO_INADEQUADO',
        description: 'Campanha contém conteúdo ofensivo',
        status: StatusDenuncia.PENDING,
        created_at: new Date(),
        user_id: 'user1',
        campanha_id: 'camp1',
        campanha_title: 'Ajuda para medicamentos',
        user_name: 'João Silva',
      },
      {
        id: '1',
        reason: 'CONTEUDO_INADEQUADO',
        description: 'Campanha contém conteúdo ofensivo',
        status: StatusDenuncia.PENDING,
        created_at: new Date(),
        user_id: 'user1',
        campanha_id: 'camp1',
        campanha_title: 'Ajuda para medicamentos',
        user_name: 'João Silva',
      },
      {
        id: '2',
        reason: 'INFORMACOES_FALSAS',
        description: 'Informações da campanha são falsas',
        status: StatusDenuncia.ANALYZED,
        created_at: new Date(),
        user_id: 'user2',
        campanha_id: 'camp2',
        campanha_title: 'Construção de escola',
        user_name: 'Maria Oliveira',
      },
      {
        id: '3',
        reason: 'SPAM',
        description: 'Campanha parece ser spam',
        status: StatusDenuncia.RESOLVED,
        created_at: new Date(),
        user_id: 'user3',
        campanha_id: 'camp3',
        campanha_title: 'Ajuda para animais abandonados',
        user_name: 'Carlos Pereira',
      },
      {
        id: '4',
        reason: 'FRAUDE_FINANCEIRA',
        description: 'Suspeita de fraude financeira na campanha',
        status: StatusDenuncia.PENDING,
        created_at: new Date(),
        user_id: 'user4',
        campanha_id: 'camp4',
        campanha_title: 'Ajuda para tratamento médico',
        user_name: 'Ana Costa',
      },
      {
        id: '5',
        reason: 'DIREITOS_AUTORAIS',
        description: 'Violação de direitos autorais na campanha',
        status: StatusDenuncia.ANALYZED,
        created_at: new Date(),
        user_id: 'user5',
        campanha_id: 'camp5',
        campanha_title: 'Apoio a artistas locais',
        user_name: 'Pedro Santos',
      },
      {
        id: '6',
        reason: 'OUTROS',
        description: 'Outro motivo não listado',
        status: StatusDenuncia.RESOLVED,
        created_at: new Date(),
        user_id: 'user6',
        campanha_id: 'camp6',
        campanha_title: 'Projeto comunitário',
        user_name: 'Lucas Almeida',
      },
    ];

    // Agrupar denúncias por campanha
    this.groupDenunciasByCampanha();
    //     },
    //   });
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

    // Filtrar por status da campanha
    if (this.selectedCampanhaStatus) {
      filtered = filtered.filter((campanha) => {
        if (this.selectedCampanhaStatus === 'ACTIVE') return !campanha.is_suspended;
        if (this.selectedCampanhaStatus === 'SUSPENDED') return campanha.is_suspended;
        return true;
      });
    }

    // Filtrar por status das denúncias
    if (this.selectedStatus) {
      filtered = filtered.filter((campanha) => campanha.denuncias.some((d) => d.status === this.selectedStatus));
    }

    return filtered;
  }

  toggleCampanhaExpanded(campanha: CampanhaGrouped) {
    campanha.expanded = !campanha.expanded;
  }

  viewDetails(denuncia: DenunciaExtended) {
    this.selectedDenuncia = denuncia;
    this.modalDetalhes = true;
  }

  updateStatus(denuncia: DenunciaExtended, newStatus: string) {
    if (!denuncia.id) return;

    this.campanhaService
      .updateDenunciaStatus(denuncia.id, newStatus)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          denuncia.status = newStatus as any;
          this.messageService.showMessage('Status', 'Status da denúncia atualizado com sucesso!');
        },
        error: (error) => {
          console.error('Erro ao atualizar status:', error);
          this.messageService.showError('Erro', 'Erro ao atualizar status da denúncia.');
        },
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

    this.campanhaService
      .suspendCampanha(this.selectedCampanha.campanha_id, this.suspensaoReason)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.selectedCampanha!.is_suspended = true;
          this.modalSuspender = false;
          this.messageService.showMessage('Sucesso', 'Campanha suspensa com sucesso!');
        },
        error: (error) => {
          console.error('Erro ao suspender campanha:', error);
          this.messageService.showError('Erro', 'Erro ao suspender campanha.');
        },
      });
  }

  reactivateCampanha(campanha: CampanhaGrouped) {
    this.campanhaService
      .reactivateCampanha(campanha.campanha_id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          campanha.is_suspended = false;
          this.messageService.showMessage('Sucesso', 'Campanha reativada com sucesso!');
        },
        error: (error) => {
          console.error('Erro ao reativar campanha:', error);
          this.messageService.showError('Erro', 'Erro ao reativar campanha.');
        },
      });
  }

  viewCampanha(campanha: CampanhaGrouped) {
    // Abrir campanha em nova aba ou navegar para ela
    window.open(`/campanha/${campanha.campanha_id}`, '_blank');
  }
}

