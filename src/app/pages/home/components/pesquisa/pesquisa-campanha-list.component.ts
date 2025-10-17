import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AuthUser } from '../../../../shared/models/auth';
import { Campanha } from '../../../../shared/models/campanha.model';
import { AuthService } from '../../../../shared/services/auth.service';
import { CampanhaService } from '../../../../shared/services/campanha.service';
import { Subject, take, takeUntil } from 'rxjs';
import { MessageConfirmationService } from '../../../../shared/services/message-confirmation.service';
import { LoadingService } from '../../../../shared/services/loading.service';
import { StatusCampanha } from '../../../../shared/enums/StatusCampanha.enum';

@Component({
  selector: 'app-pesquisa-campanha-list',
  templateUrl: './pesquisa-campanha-list.component.html',
  styleUrls: ['./pesquisa-campanha-list.component.css'],
  providers: [MessageService],
})
export class PesquisaCampanhaListComponent implements OnInit, OnDestroy {
  @Input() campanhaSelected: Campanha | null = null;
  @Output() donated: EventEmitter<any> = new EventEmitter();

  userSession: AuthUser | null = null;
  showMoreCampanhas: boolean = false;
  loading: boolean = false;
  modalCampanha: boolean = false;
  modalDonate: boolean = false;
  modalReport: boolean = false;
  modalComments: boolean = false;
  categoriesFormatted: string = '';
  valueDonation: number = 0;
  page: number = 1;
  timeout: any;
  campanhaSearchResults: Campanha[] = [];
  isMobile: boolean = false;
  modalLogin: boolean = false;

  searchText: string = '';
  category: any = { name: 'Todos' };

  categorys: any[] = [
    { name: 'Todos' },
    { name: 'Alimentação' },
    { name: 'Saúde' },
    { name: 'Vestuário' },
    { name: 'Educação' },
    { name: 'Moradia' },
    { name: 'Transporte' },
    { name: 'Trabalho' },
    { name: 'Dinheiro' },
    { name: 'Esporte' },
    { name: 'Justiça' },
    { name: 'Tecnologia' },
    { name: 'Outros' },
  ];

  private camapanhaService = inject(CampanhaService);
  private authService = inject(AuthService);
  private breakpointObserver = inject(BreakpointObserver);
  private messageConfirmationService = inject(MessageConfirmationService);
  private destroy$ = new Subject();
  private loadingService = inject(LoadingService);

  ngOnInit(): void {
    this.searchItens();
    this.handleWindowSize();

    this.userSession = this.authService.getAuthResponse() || null;
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  handleWindowSize() {
    this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small]).subscribe((result) => {
      this.isMobile = result.matches;
    });
  }

  onScroll() {
    if (this.loading) return;
    this.page++;
    this.searchItens();
  }

  openModalCampanha(campanha: Campanha) {
    this.campanhaSelected = campanha;
    this.categoriesFormatted = this.campanhaSelected.category.join(', ');
    this.modalCampanha = true;
  }

  handleFilter() {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.page = 1;
      this.searchItens(true);
    }, 150);
  }

  searchItens(bySearch: boolean = false) {
    this.loading = true;

    const body = {
      search: this.searchText,
      category: this.category.name == 'Todos' ? '' : this.category.name,
      page: this.page,
      itemsPerPage: 12,
    };

    this.showMoreCampanhas = true;
    this.loadingService.start();
    this.camapanhaService
      .searchCampanha(body)
      .pipe(takeUntil(this.destroy$), take(1))
      .subscribe({
        next: (response: any) => {
          if (response) {
            const items = response.Items as Campanha[];

            if (items.length > 0) {
              this.campanhaSearchResults.length == 0 || bySearch
                ? (this.campanhaSearchResults = items)
                : this.campanhaSearchResults.push(...items);
            } else {
              body.page == 1 ? (this.campanhaSearchResults = []) : '';
            }
          }
        },
        error: () => {
          this.campanhaSearchResults = [];
        },
      })
      .add(() => {
        this.showMoreCampanhas = false;
        this.loadingService.done();
        this.loading = false;
      });
  }

  getProgress(campanha: Campanha): number {
    if (!campanha.value_donated) return 0;

    if (campanha.value_required > 0 && campanha.value_donated >= 0) {
      return parseFloat((((campanha.value_donated ?? 0) / campanha.value_required) * 100).toFixed(2));
    }

    return 0;
  }

  userNotLogged() {
    this.messageConfirmationService.confirmWarning({
      message: 'Realize o login para continuar com a doação',
      accept: () => {
        this.authService.logout();
      },
    });
  }

  onReportCampanha(campanha: Campanha) {
    if (!this.userSession) {
      this.modalLogin = true;
      return;
    }
    this.campanhaSelected = campanha;
    this.modalReport = true;
  }

  onCommentCampanha(campanha: Campanha) {
    console.log(campanha);
    console;
    if (!this.userSession) {
      this.modalLogin = true;
      return;
    }
    this.campanhaSelected = campanha;
    this.modalComments = true;
  }

  canDonate(): boolean {
    return this.campanhaSelected?.status === StatusCampanha.ACTIVE;
  }

  hasValidAddress(): boolean {
    if (!this.campanhaSelected || !this.campanhaSelected.have_address) return false;

    const campanha = this.campanhaSelected;
    return !!(campanha?.address.street?.trim() && campanha?.address.city?.trim());
  }

  getFormattedAddress(): string {
    if (!this.campanhaSelected) return '';

    const campanha = this.campanhaSelected;
    const parts: string[] = [];

    if (campanha?.address.street?.trim()) {
      let streetWithNumber = campanha?.address.street?.trim();

      if (campanha?.address.number?.trim()) {
        streetWithNumber += `, nº ${campanha?.address.number?.trim()}`;
      }

      parts.push(streetWithNumber);
    }

    if (campanha?.address.complement?.trim()) {
      parts.push(campanha?.address.complement?.trim());
    }

    return parts.join(' - ');
  }

  getCityStateFormatted(): string {
    if (!this.campanhaSelected) return '';

    const campanha = this.campanhaSelected;
    const parts: string[] = [];

    if (campanha?.address.city?.trim()) {
      parts.push(campanha?.address.city?.trim());
    }

    if (campanha?.address.state?.trim()) {
      parts.push(campanha?.address.state?.trim());
    }

    let location = parts.join(' - ');

    if (campanha?.address.zipcode?.trim()) {
      location += ` • CEP: ${campanha?.address.zipcode.trim()}`;
    }

    return location;
  }

  openGoogleMaps(): void {
    if (!this.campanhaSelected) return;

    const campanha = this.campanhaSelected;
    let searchQuery = '';

    const addressParts: string[] = [];

    if (campanha?.address.street?.trim()) {
      let street = campanha?.address.street.trim();
      if (campanha?.address.number?.trim()) {
        street += `, ${campanha?.address.number.trim()}`;
      }
      addressParts.push(street);
    }

    if (campanha?.address.neighborhood?.trim()) {
      addressParts.push(campanha?.address.neighborhood.trim());
    }

    if (campanha?.address.city?.trim()) {
      addressParts.push(campanha?.address.city.trim());
    }

    if (campanha?.address.state?.trim()) {
      addressParts.push(campanha?.address.state.trim());
    }

    if (campanha?.address.zipcode?.trim()) {
      addressParts.push(campanha?.address.zipcode.trim());
    }

    searchQuery = addressParts.join(', ');

    if (searchQuery) {
      const encodedQuery = encodeURIComponent(searchQuery);
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`;

      window.open(googleMapsUrl, '_blank');
    }
  }

  donate() {
    if (!this.userSession) {
      this.modalLogin = true;
      return;
    }

    if (this.loading) return;

    if (!this.canDonate()) {
      this.messageConfirmationService.showWarning(
        'Campanha Finalizada',
        'Esta campanha já foi finalizada e não aceita mais doações.'
      );
      return;
    }

    this.loading = true;
    this.loadingService.start();

    const body = {
      campanha_id: this.campanhaSelected!.campanha_id,
      value: this.valueDonation,
    };

    this.camapanhaService
      .donateCampanha(body)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.campanhaSelected!.value_donated += this.valueDonation;
          this.searchItens(true);
          this.donated.emit();
          this.messageConfirmationService.showMessage('Doação', 'Doação realizada com sucesso!');
        },
        error: () => {
          this.messageConfirmationService.showError('Doação', 'Erro ao realizar doação!');
        },
      })
      .add(() => {
        this.valueDonation = 0;
        this.campanhaSelected = null;
        this.modalDonate = false;
        this.loading = false;
        this.modalCampanha = false;
        this.loadingService.done();
      });
  }
}

