import { Component, EventEmitter, Input, Output, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CampanhaService } from '../../../../../../shared/services/campanha.service';
import { DenunciaReasons } from '../../../../../../shared/models/denuncia.model';
import { Campanha } from '../../../../../../shared/models/campanha.model';
import { MessageConfirmationService } from '../../../../../../shared/services/message-confirmation.service';
import { AuthUser } from '../../../../../../shared/models/auth';

@Component({
  selector: 'app-report-modal',
  templateUrl: './report-modal.component.html',
  styleUrl: './report-modal.component.css',
})
export class ReportModalComponent implements OnInit {
  @Input() visible: boolean = false;
  @Input() campanha: Campanha | null = null;
  @Input() userSession: AuthUser | null = null;
  @Output() onClose = new EventEmitter<void>();

  reportForm!: FormGroup;
  reasons = DenunciaReasons;
  loading = false;

  private fb = inject(FormBuilder);
  private campanhaService = inject(CampanhaService);
  private messageService = inject(MessageConfirmationService);

  ngOnInit() {
    this.reportForm = this.fb.group({
      reason: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
    });
  }

  onSubmit() {
    if (this.reportForm.invalid || !this.campanha) return;

    if (!this.userSession) {
      this.messageService.showError('Erro', 'Você precisa estar logado para enviar uma denúncia.');
      return;
    }

    this.loading = true;
    const reportData = {
      reason: this.reason?.value,
      description: this.description?.value,
      user: this.userSession,
      campanha: {
        campanha_id: this.campanha.campanha_id,
        title: this.campanha.title,
      },
    };

    this.campanhaService.reportCampanha(reportData).subscribe({
      next: () => {
        this.messageService.showMessage('Denúncia', 'Denúncia enviada com sucesso!');
        this.closeModal();
      },
      error: () => {
        this.messageService.showError('Erro', 'Erro ao enviar denúncia. Tente novamente.');
        this.loading = false;
      },
    });
  }

  closeModal() {
    this.visible = false;
    this.reportForm.reset();
    this.loading = false;
    this.onClose.emit();
  }

  getFieldError(field: string): string {
    const control = this.reportForm.get(field);
    if (control?.errors && control.touched) {
      if (control.errors['required']) return `${field === 'reason' ? 'Motivo' : 'Descrição'} é obrigatório`;
      if (control.errors['minlength']) return `Descrição deve ter pelo menos 10 caracteres`;
      if (control.errors['maxlength']) return `Descrição deve ter no máximo 500 caracteres`;
    }
    return '';
  }

  get reason() {
    return this.reportForm.get('reason');
  }

  get description() {
    return this.reportForm.get('description');
  }
}

