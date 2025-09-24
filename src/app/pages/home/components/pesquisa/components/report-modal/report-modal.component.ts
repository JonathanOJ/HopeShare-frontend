import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CampanhaService } from '../../../../../../shared/services/campanha.service';
import { DenunciaReasons, CreateDenunciaRequest } from '../../../../../../shared/models/denuncia.model';
import { Campanha } from '../../../../../../shared/models/campanha.model';
import { MessageConfirmationService } from '../../../../../../shared/services/message-confirmation.service';

@Component({
  selector: 'app-report-modal',
  templateUrl: './report-modal.component.html',
  styleUrl: './report-modal.component.css',
})
export class ReportModalComponent implements OnInit {
  @Input() visible: boolean = false;
  @Input() campanha: Campanha | null = null;
  @Output() onClose = new EventEmitter<void>();

  reportForm!: FormGroup;
  reasons = DenunciaReasons;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private campanhaService: CampanhaService,
    private messageService: MessageConfirmationService
  ) {}

  ngOnInit() {
    this.reportForm = this.fb.group({
      reason: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
    });
  }

  onSubmit() {
    if (this.reportForm.invalid || !this.campanha) return;

    this.loading = true;
    const reportData: CreateDenunciaRequest = this.reportForm.value;

    this.campanhaService.reportCampanha(this.campanha.campanha_id, reportData).subscribe({
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
}
