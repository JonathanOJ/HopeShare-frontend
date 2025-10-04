import { Component, inject, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Recebimento } from '../../../shared/models/recebimento.model';
import { ValidacaoDocumento } from '../../../shared/models/validacao-documentos.model';
import { StatusValidacaoDocumentos } from '../../../shared/enums/StatusValidacaoDocumentos.enum';
import { StatusDenuncia } from '../../../shared/enums/StatusDenuncia.enum';
import { MessageConfirmationService } from '../../../shared/services/message-confirmation.service';
import { Denuncia } from '../../../shared/models/denuncia.model';
import { SolicitacaoDeposito } from '../../../shared/models/solicitacao-deposito.model';
import { Banco } from '../../../shared/constants/bancos';
import { StatusSolicitacaoDeposito } from '../../../shared/enums/StatusSolicitacaoDeposito.enum';
import { StatusCampanha } from '../../../shared/enums/StatusCampanha.enum';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css'],
})
export class AdminPanelComponent implements OnInit {
  activeTab: 'validacoes' | 'denuncias' | 'depositos' = 'validacoes';

  // Data arrays for child components
  validacoesPendentes: ValidacaoDocumento[] = [];
  denuncias: Denuncia[] = [];
  solicitacoes: SolicitacaoDeposito[] = [];

  // Loading states
  loading = false;
  denunciasLoading = false;
  solicitacoesLoading = false;

  private messageConfirmationService = inject(MessageConfirmationService);

  ngOnInit(): void {
    this.loadValidacoesPendentes();
    this.loadDenuncias();
    this.loadSolicitacoes();
  }

  // Métodos de carregamento de dados
  loadValidacoesPendentes(): void {
    this.loading = true;
    setTimeout(() => {
      this.validacoesPendentes = [
        {
          id: '1',
          user_id: 'user1',
          user_name: 'João Silva',
          user_email: 'joao@email.com',
          empresa_nome: 'Empresa ABC',
          cnpj: '12.345.678/0001-90',
          data_envio: new Date(),
          status: StatusValidacaoDocumentos.PENDING,
          documentos: ['documento1.pdf', 'documento2.pdf'],
          recebimento_config: {
            banco: { code: 1, name: 'Banco do Brasil', fullName: 'Banco do Brasil S.A.' } as Banco,
            agency: '1234-5',
            account_number: '12345-6',
            account_type: 'Conta Corrente',
          },
        } as any,
      ];
      this.loading = false;
    }, 300);
  }

  loadDenuncias(): void {
    this.denunciasLoading = true;
    setTimeout(() => {
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
        } as any,
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
        } as any,
      ];
      this.denunciasLoading = false;
    }, 300);
  }

  loadSolicitacoes(): void {
    this.solicitacoesLoading = true;
    setTimeout(() => {
      this.solicitacoes = [
        {
          id: '1',
          campanha_id: 'camp1',
          user_id: 'user1',
          value_requested: 5000,
          status: StatusSolicitacaoDeposito.PENDING,
          request_message: 'Preciso do valor para comprar os medicamentos urgentemente.',
          created_at: new Date('2024-01-15'),
          campanha: {
            campanha_id: 'camp1',
            title: 'Ajuda para medicamentos',
            value_donated: 5200,
            value_required: 5000,
            status: StatusCampanha.ACTIVE,
          } as any,
          user: {
            user_id: 'user1',
            username: 'Maria Silva',
            email: 'maria@email.com',
          } as any,
        },
      ];
      this.solicitacoesLoading = false;
    }, 300);
  }

  // Métodos para mudança de abas
  changeTab(tab: 'validacoes' | 'denuncias' | 'depositos'): void {
    this.activeTab = tab;
  }
}

