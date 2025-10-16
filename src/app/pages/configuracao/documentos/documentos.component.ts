import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageConfirmationService } from '../../../shared/services/message-confirmation.service';
import { ValidacaoUsuario } from '../../../shared/models/validacao-usuario';
import { StatusValidacaoUsuario } from '../../../shared/enums/StatusValidacaoUsuario.enum';
import { LoadingService } from '../../../shared/services/loading.service';
import { ValidacaoUsuarioService } from '../../../shared/services/validacao-usuario.service';
import { AuthUser } from '../../../shared/models/auth';
import { Subject, takeUntil, take } from 'rxjs';
import { SupportDialogService } from '../../../shared/services/support-dialog.service';
import { FileUpload } from 'primeng/fileupload';

@Component({
  selector: 'app-documentos',
  templateUrl: './documentos.component.html',
  styleUrls: ['./documentos.component.css'],
})
export class DocumentosComponent implements OnInit, OnChanges, OnDestroy {
  @Input() user: AuthUser | null = null;
  @Input() validacaoUsuario: ValidacaoUsuario | null = null;
  @Output() getValidacaoEvent: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('fileUpload') fileUpload!: FileUpload;

  validationForm!: FormGroup;
  loading = false;
  arquivosEnviados: File[] = [];

  private fb = inject(FormBuilder);
  private messageConfirmationService = inject(MessageConfirmationService);
  private loadingService = inject(LoadingService);
  private supportDialogService = inject(SupportDialogService);
  private validacaoUsuarioService = inject(ValidacaoUsuarioService);

  private destroy$ = new Subject();

  ngOnInit(): void {
    if (!this.validationForm) {
      this.initializeForm();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['validacaoUsuario'] && this.validacaoUsuario) {
      if (!this.validationForm) {
        this.initializeForm();
      }
      this.validationForm.patchValue(this.validacaoUsuario);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  initializeForm(): void {
    this.validationForm = this.fb.group({
      validation_id: [''],
      user: [this.user, [Validators.required]],
      status: [StatusValidacaoUsuario.PENDING],
      company_name: ['', Validators.required],
      cnpj: [this.user?.cnpj, [Validators.required]],
      observation: [''],
      updated_at: [null],
    });
  }

  openSupportDialog(): void {
    this.supportDialogService.open();
  }

  onUpload(event: any): void {
    try {
      const filesArray: File[] = Array.isArray(event.files) ? event.files : Array.from(event.files || []);

      this.arquivosEnviados = [...this.arquivosEnviados, ...filesArray];

      this.messageConfirmationService.showMessage(
        'Arquivos Adicionados',
        `${filesArray.length} arquivo(s) adicionado(s) com sucesso`
      );
    } catch (error) {
      console.error('Erro ao processar arquivos:', error);
      this.messageConfirmationService.showError('Erro', 'Falha ao processar os arquivos. Tente novamente.');
    }
  }

  onRemoveFile(event: any): void {
    this.arquivosEnviados = this.arquivosEnviados.filter((file: File) => file.name !== event.file.name);
  }

  onSubmit(): void {
    if (this.validationForm.invalid) {
      this.validationForm.markAllAsTouched();
      this.messageConfirmationService.showWarning(
        'Formulário Incompleto',
        'Por favor, preencha todos os campos obrigatórios'
      );
      return;
    }

    if (this.arquivosEnviados.length === 0) {
      this.messageConfirmationService.showWarning(
        'Documentos Obrigatórios',
        'Por favor, envie pelo menos um documento'
      );
      return;
    }

    this.loading = true;
    this.loadingService.start();

    const formData = new FormData();

    const userSimple = {
      user_id: this.user?.user_id,
      username: this.user?.username,
      email: this.user?.email,
      type_user: this.user?.type_user,
      cpf: this.user?.cpf,
      cnpj: this.user?.cnpj,
    };

    formData.append('user', JSON.stringify(userSimple));
    formData.append('company_name', this.validationForm.get('company_name')?.value);
    formData.append('cnpj', this.validationForm.get('cnpj')?.value);
    formData.append('status', this.validationForm.get('status')?.value);

    if (this.validationForm.get('validation_id')?.value) {
      formData.append('validation_id', this.validationForm.get('validation_id')?.value);
    }

    this.arquivosEnviados.forEach((file: File) => {
      formData.append('documents', file, file.name);
    });

    this.validacaoUsuarioService
      .save(formData)
      .pipe(takeUntil(this.destroy$), take(1))
      .subscribe({
        next: (response: any) => {
          this.messageConfirmationService.showMessage(
            'Documentos Enviados',
            'Seus documentos foram enviados para validação. Aguarde 2-5 dias úteis para análise.'
          );
          this.arquivosEnviados = [];

          if (this.fileUpload) {
            this.fileUpload.clear();
          }

          this.getValidacaoEvent.emit();
        },
        error: (error: any) => {
          const errorMessage = error?.error?.message || 'Ocorreu um erro ao enviar os documentos.';
          this.messageConfirmationService.showError('Erro', errorMessage);
        },
      })
      .add(() => {
        this.loading = false;
        this.loadingService.done();
      });
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

  get status() {
    return this.validationForm.get('status')?.value;
  }

  get company_name() {
    return this.validationForm.get('company_name')?.value;
  }

  get cnpj() {
    return this.validationForm.get('cnpj')?.value;
  }

  get observation() {
    return this.validationForm.get('observation')?.value;
  }

  get updatedAt() {
    return this.validationForm.get('updated_at')?.value;
  }

  get documentos() {
    return this.validationForm.get('documentos')?.value;
  }

  getFileTypeLabel(type: string): string {
    const typeMap: { [key: string]: string } = {
      'application/pdf': 'PDF',
      'image/jpeg': 'JPEG',
      'image/jpg': 'JPG',
      'image/png': 'PNG',
    };
    return typeMap[type] || 'Arquivo';
  }

  viewDocument(url: string): void {
    window.open(url, '_blank');
  }

  downloadDocument(url: string, filename: string): void {
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        window.URL.revokeObjectURL(link.href);
      })
      .catch((error) => {
        console.error('Erro ao baixar documento:', error);
        this.messageConfirmationService.showError('Erro', 'Não foi possível baixar o documento.');
      });
  }
}

