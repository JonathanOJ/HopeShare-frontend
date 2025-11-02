import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { SupportDialogService } from '../../services/support-dialog.service';
import { MessageConfirmationService } from '../../services/message-confirmation.service';

@Component({
  selector: 'app-support-dialog',
  templateUrl: './support-dialog.component.html',
  styleUrls: ['./support-dialog.component.css'],
})
export class SupportDialogComponent implements OnInit, OnDestroy {
  visible = false;
  supportForm!: FormGroup;
  loading = false;

  private fb = inject(FormBuilder);
  private supportDialogService = inject(SupportDialogService);
  private messageConfirmationService = inject(MessageConfirmationService);
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.supportForm = this.fb.group({
      name: ['', Validators.required],
      subject: ['', Validators.required],
      message: ['', Validators.required],
    });

    this.supportDialogService.visible$.pipe(takeUntil(this.destroy$)).subscribe((visible) => {
      this.visible = visible;
      if (visible) {
        this.supportForm.reset();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  sendSupportEmail(): void {
    if (this.supportForm.invalid) {
      this.supportForm.markAllAsTouched();
      this.messageConfirmationService.showWarning(
        'Formulário Incompleto',
        'Por favor, preencha todos os campos obrigatórios.'
      );
      return;
    }

    this.loading = true;
    setTimeout(() => {
      this.messageConfirmationService.showMessage(
        'Mensagem Enviada',
        'Sua mensagem foi enviada com sucesso! Nossa equipe entrará em contato em breve.'
      );
      this.loading = false;
      this.closeDialog();
    }, 1500);
  }

  closeDialog(): void {
    this.visible = false;
    this.supportDialogService.close();
  }

  get name() {
    return this.supportForm.get('name');
  }

  get subject() {
    return this.supportForm.get('subject');
  }

  get message() {
    return this.supportForm.get('message');
  }
}

