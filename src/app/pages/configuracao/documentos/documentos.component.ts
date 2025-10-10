import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageConfirmationService } from '../../../shared/services/message-confirmation.service';
import { ValidacaoUsuario } from '../../../shared/models/validacao-usuario';
import { StatusValidacaoUsuario } from '../../../shared/enums/StatusValidacaoUsuario.enum';

@Component({
  selector: 'app-documentos',
  templateUrl: './documentos.component.html',
  styleUrls: ['./documentos.component.css'],
})
export class DocumentosComponent implements OnInit {
  empresaForm!: FormGroup;
  loading = false;
  arquivosEnviados: any[] = [];

  validacaoUsuario: ValidacaoUsuario | null = null;

  private fb = inject(FormBuilder);
  private messageConfirmationService = inject(MessageConfirmationService);

  ngOnInit(): void {
    this.empresaForm = this.fb.group({
      validation_id: [''],
      status: ['PENDING'],
      cnpj: [''],
      observation: [''],
      updated_at: [''],
      documentos: [[], Validators.required],
    });

    this.getValidacaoByUser();
  }

  onUpload(event: any): void {
    this.arquivosEnviados = [...this.arquivosEnviados, ...event.files];
    this.empresaForm.patchValue({ documentos: this.arquivosEnviados });

    this.messageConfirmationService.showMessage(
      'Arquivos Adicionados',
      `${event.files.length} arquivo(s) adicionado(s) com sucesso`
    );
  }

  onRemoveFile(event: any): void {
    this.arquivosEnviados = this.arquivosEnviados.filter((arquivo) => arquivo !== event.file);
    this.empresaForm.patchValue({ documentos: this.arquivosEnviados });
  }

  onSubmit(): void {
    if (this.empresaForm.valid) {
      this.empresaForm.markAllAsTouched();
      this.messageConfirmationService.showWarning(
        'Formulário Incompleto',
        'Por favor, preencha todos os campos obrigatórios'
      );
    }

    this.loading = true;

    setTimeout(() => {
      console.log('Dados da empresa:', this.empresaForm.value);

      this.messageConfirmationService.showMessage(
        'Documentos Enviados',
        'Seus documentos foram enviados para validação. Aguarde 2-5 dias úteis para análise.'
      );

      this.loading = false;
    }, 2000);
  }

  getValidacaoByUser(): void {
    this.loading = true;

    // setTimeout(() => {
    //   const respostaSimulada: ValidacaoUsuario = {
    //     validation_id: '12345',
    //     user_id: '67890',
    //     status: StatusValidacaoUsuario.REQUIRES_ACTION,
    //     cnpj: '12.345.678/0001-90',
    //     observation:
    //       'Por favor, reenvie o comprovante de endereço. O documento atual está com data superior a 90 dias.',
    //     observation_read: false,
    //     updated_at: new Date('2024-10-01T10:00:00Z'),
    //     documentos: [
    //       {
    //         name: 'contrato_social.pdf',
    //         url: 'url/to/contrato_social.pdf',
    //         file: new File([], 'contrato_social.pdf', { type: 'application/pdf' }),
    //       },
    //       {
    //         name: 'comprovante_endereco.jpg',
    //         url: 'url/to/comprovante_endereco.jpg',
    //         file: new File([], 'comprovante_endereco.jpg', { type: 'image/jpeg' }),
    //       },
    //     ],
    //   };

    //   this.ValidacaoUsuario = respostaSimulada;

    //   this.empresaForm.patchValue({
    //     validation_id: respostaSimulada.validation_id,
    //     status: respostaSimulada.status,
    //     cnpj: respostaSimulada.cnpj,
    //     observation: respostaSimulada.observation,
    //     updated_at: respostaSimulada.updated_at,
    //     documentos: respostaSimulada.documentos,
    //   });

    //   this.arquivosEnviados = respostaSimulada.documentos.map((doc) => doc.file);

    //   this.loading = false;
    // }, 2000);
  }

  validarCNPJ(): boolean {
    const cnpj = this.empresaForm.get('cnpj')?.value;
    if (!cnpj) return false;

    const cnpjLimpo = cnpj.replace(/\D/g, '');
    return cnpjLimpo.length === 14;
  }

  marcarObservacaoLida(): void {
    if (this.validacaoUsuario) {
      this.validacaoUsuario.observation_read = true;

      this.messageConfirmationService.showMessage(
        'Observação Marcada como Lida',
        'A observação foi marcada como lida com sucesso'
      );
    }
  }

  getTipoObservacao(): 'info' | 'warning' | 'error' {
    if (!this.validacaoUsuario) return 'info';

    switch (this.validacaoUsuario.status) {
      case StatusValidacaoUsuario.APPROVED:
        return 'info';
      case StatusValidacaoUsuario.REQUIRES_ACTION:
        return 'warning';
      case StatusValidacaoUsuario.REJECTED:
        return 'error';
      default:
        return 'info';
    }
  }

  getStatusLabel(): string {
    if (!this.validacaoUsuario) return 'Aguardando documentos';

    switch (this.validacaoUsuario.status) {
      case StatusValidacaoUsuario.PENDING:
        return 'Em análise';
      case StatusValidacaoUsuario.APPROVED:
        return 'Aprovado';
      case StatusValidacaoUsuario.REQUIRES_ACTION:
        return 'Ação necessária';
      case StatusValidacaoUsuario.REJECTED:
        return 'Rejeitado';
      default:
        return 'Aguardando documentos';
    }
  }

  getStatusIcon(): string {
    if (!this.validacaoUsuario) return 'pi-clock';

    switch (this.validacaoUsuario.status) {
      case StatusValidacaoUsuario.PENDING:
        return 'pi-clock';
      case StatusValidacaoUsuario.APPROVED:
        return 'pi-check-circle';
      case StatusValidacaoUsuario.REQUIRES_ACTION:
        return 'pi-exclamation-triangle';
      case StatusValidacaoUsuario.REJECTED:
        return 'pi-times-circle';
      default:
        return 'pi-clock';
    }
  }

  getStatusColor(): string {
    if (!this.validacaoUsuario) return 'gray';

    switch (this.validacaoUsuario.status) {
      case StatusValidacaoUsuario.PENDING:
        return 'yellow';
      case StatusValidacaoUsuario.APPROVED:
        return 'green';
      case StatusValidacaoUsuario.REQUIRES_ACTION:
        return 'yellow';
      case StatusValidacaoUsuario.REJECTED:
        return 'red';
      default:
        return 'gray';
    }
  }
}

