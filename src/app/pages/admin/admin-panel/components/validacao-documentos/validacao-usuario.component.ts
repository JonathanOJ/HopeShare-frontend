import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { StatusValidacaoUsuario } from '../../../../../shared/enums/StatusValidacaoUsuario.enum';
import { MessageConfirmationService } from '../../../../../shared/services/message-confirmation.service';
import { Banco } from '../../../../../shared/models/banco.model';
import { ValidacaoUsuario } from '../../../../../shared/models/validacao-usuario';
import { ValidacaoUsuarioService } from '../../../../../shared/services/validacao-usuario.service';
import { AuthUser } from '../../../../../shared/models/auth';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-validacao-usuario',
  templateUrl: './validacao-usuario.component.html',
  styleUrl: './validacao-usuario.component.css',
})
export class ValidacaoUsuarioComponent implements OnInit {
  @Input() userSession: AuthUser | null = null;
  @Input() validacoesPendentes: ValidacaoUsuario[] = [];
  @Input() loading: boolean = false;
  @Output() refresh = new EventEmitter<void>();

  selectedValidation: ValidacaoUsuario | null = null;

  showValidationModal: boolean = false;

  formAdmin!: FormGroup;

  private messageConfirmationService = inject(MessageConfirmationService);
  private validacaoUsuarioService = inject(ValidacaoUsuarioService);
  private fb = inject(FormBuilder);

  ngOnInit(): void {
    this.formAdmin = this.fb.group({
      observacao: [''],
      decisao: [StatusValidacaoUsuario.APPROVED],
    });
  }

  refreshListEmit(): void {
    this.refresh.emit();
  }

  getBancoDisplay(banco: Banco): string {
    if (!banco) return '';
    return banco.code ? `${banco.code} - ${banco.name}` : banco.name;
  }

  openValidationModal(validation: ValidacaoUsuario): void {
    this.selectedValidation = validation;
    this.showValidationModal = true;

    this.formAdmin.patchValue({
      observacao: '',
      decisao: StatusValidacaoUsuario.APPROVED,
    });
  }

  viewDocument(doc: { name: string; url: string }): void {
    window.open(doc.url, '_blank');
  }

  processValidation(): void {
    if (!this.selectedValidation || this.formAdmin.invalid) {
      this.messageConfirmationService.showError('Erro', 'Formulário inválido ou validação não selecionada.');
      return;
    }

    this.loading = true;

    const payload = {
      user_id: this.userSession?.user_id,
      validation_id: this.selectedValidation.validation_id,
      status: this.decisao?.value,
      observation: this.observacao?.value,
    };

    this.validacaoUsuarioService
      .updateValidationAdmin(payload)
      .subscribe({
        next: () => {
          this.showValidationModal = false;
          this.messageConfirmationService.showMessage(
            'Validação Processada',
            `Documentos ${this.decisao?.value === 'APPROVED' ? 'aprovados' : 'rejeitados'} com sucesso!`
          );
          this.refreshListEmit();
          this.selectedValidation = null;
        },
        error: () => {
          this.messageConfirmationService.showError(
            'Erro',
            'Ocorreu um erro ao processar a validação. Tente novamente mais tarde.'
          );
        },
      })
      .add(() => {
        this.loading = false;
      });
  }

  get observacao() {
    return this.formAdmin.get('observacao');
  }

  get decisao() {
    return this.formAdmin.get('decisao');
  }
}

