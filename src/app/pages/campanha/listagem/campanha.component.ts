import { AfterViewInit, Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { Subject, take, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { Campanha } from '../../../shared/models/campanha.model';
import { CampanhaService } from '../../../shared/services/campanha.service';
import { AuthService } from '../../../shared/services/auth.service';
import { AuthUser } from '../../../shared/models/auth';
import { MessageConfirmationService } from '../../../shared/services/message-confirmation.service';

@Component({
  selector: 'app-campanha',
  templateUrl: './campanha.component.html',
  styleUrl: './campanha.component.css',
})
export class CampanhaComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('dt2') dt2: Table | undefined;

  isMobile: boolean = window.innerWidth < 768;
  visible: boolean = false;
  searchValue: string = '';
  campanhas: Campanha[] = [];
  campanha: Campanha | null = null;
  selectedItem: Campanha | null = null;
  userSession: AuthUser | null = null;
  loading: boolean = false;

  private destroy$ = new Subject();

  private campanhaService = inject(CampanhaService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private messageConfirmationService = inject(MessageConfirmationService);

  ngAfterViewInit(): void {
    this.isMobile ? this.router.navigate(['hopeshare/home']) : '';
  }

  ngOnInit(): void {
    const authResponse = this.authService.getAuthResponse();
    authResponse && authResponse ? (this.userSession = authResponse) : this.router.navigate(['/login']);

    this.getCampanhas();
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  getCampanhas() {
    this.loading = true;

    this.campanhaService
      .findCampanhaByUser(this.userSession!.user_id)
      .pipe(takeUntil(this.destroy$), take(1))
      .subscribe({
        next: (resp: Campanha[]) => {
          this.campanhas = resp;

          this.campanhas.forEach((campanha) => {
            campanha.progress_percentage = this.getProgress(campanha);
          });
        },
        error: () => {
          this.messageConfirmationService.showError('Erro', 'Erro ao carregar campanhas!');
        },
      })
      .add(() => (this.loading = false));
  }

  onInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.dt2 ? this.dt2.filterGlobal(inputElement.value || '', 'contains') : '';
  }

  clear(table: Table) {
    table.clear();
    this.searchValue = '';
  }

  handleCreateMode() {
    this.router.navigate(['hopeshare/campanha/cadastro']);
  }

  onEdit(campanha_id: string) {
    this.router.navigate([`hopeshare/campanha/editar/${campanha_id}`]);
  }

  onDelete(id: string) {
    this.campanhaService
      .deleteCampanha(id)
      .pipe(takeUntil(this.destroy$), take(1))
      .subscribe({
        next: () => {
          this.campanhas = this.campanhas.filter((h) => h.campanha_id !== id);
          this.messageConfirmationService.showMessage('Sucesso', 'Campanha deletada com sucesso!');
        },
        error: (error: any) => {
          let errorMessage = '';

          error.status == 400 ? (errorMessage = error.error.error) : (errorMessage = 'Erro ao deletar campanha!');
          this.messageConfirmationService.showError('Erro', errorMessage);
        },
      });
  }

  getProgress(campanha: Campanha): number {
    if (!campanha.value_donated) return 0;

    if (campanha.value_required > 0 && campanha.value_donated >= 0) {
      return parseFloat((((campanha.value_donated ?? 0) / campanha.value_required) * 100).toFixed(2));
    }

    return 0;
  }
}

