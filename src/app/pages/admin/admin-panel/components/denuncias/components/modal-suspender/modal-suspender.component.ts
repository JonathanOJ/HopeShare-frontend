import { Component, OnDestroy, Input, inject } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AuthUser } from '../../../../../../../shared/models/auth';
import { DenunciaCampanhaGrouped } from '../../../../../../../shared/models/campanha.model';
import { CampanhaService } from '../../../../../../../shared/services/campanha.service';
import { LoadingService } from '../../../../../../../shared/services/loading.service';
import { MessageConfirmationService } from '../../../../../../../shared/services/message-confirmation.service';

@Component({
  selector: 'app-modal-suspender',
  templateUrl: './modal-suspender.component.html',
  styleUrl: './modal-suspender.component.css',
})
export class ModalSuspenderComponent implements OnDestroy {
  @Input() userSession!: AuthUser;
  @Input() modalSuspender: boolean = false;
  @Input() selectedCampanha!: DenunciaCampanhaGrouped;
  @Input() suspensaoReason: string = '';

  private loadingService = inject(LoadingService);
  private campanhaService = inject(CampanhaService);
  private messageService = inject(MessageConfirmationService);
  private destroy$ = new Subject<void>();

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  suspendCampanha() {
    if (!this.selectedCampanha || !this.suspensaoReason.trim()) {
      this.messageService.showWarning('Atenção', 'Por favor, informe o motivo da suspensão.');
      return;
    }

    this.loadingService.start();
    this.campanhaService
      .suspendCampanha(this.selectedCampanha.campanha_id, this.suspensaoReason, this.userSession!.user_id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.selectedCampanha!.is_suspended = true;
          this.modalSuspender = false;
          this.messageService.showMessage('Sucesso', 'Campanha suspensa com sucesso!');
        },
        error: () => {
          this.messageService.showError('Erro', 'Erro ao suspender campanha.');
        },
      })
      .add(() => {
        this.loadingService.done();
      });
  }
}

