import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AutoCompleteSelectEvent } from 'primeng/autocomplete';
import { Recebimento } from '../../../shared/models/recebimento.model';
import { AuthUser } from '../../../shared/models/auth';
import { Banco } from '../../../shared/models/banco.model';
import { BancoService } from '../../../shared/services/banco.service';
import { takeUntil, take, Subject } from 'rxjs';
import { MessageConfirmationService } from '../../../shared/services/message-confirmation.service';
import { LoadingService } from '../../../shared/services/loading.service';

@Component({
  selector: 'app-recebimento',
  templateUrl: './recebimento.component.html',
  styleUrls: ['./recebimento.component.css'],
})
export class RecebimentoComponent implements OnInit, OnDestroy {
  @Input() user: AuthUser | null = null;

  recebimentoForm!: FormGroup;
  loading = false;
  showPreview = false;
  hasConfiguredBank = false;

  bancos: Banco[] = [];
  bancosFiltrados: Banco[] = [];
  bancoSelecionado: Banco | null = null;

  recebimentoConfig: Recebimento | null = null;

  tiposConta = [
    { label: 'Conta Corrente', value: 'CORRENTE' },
    { label: 'Conta Poupança', value: 'POUPANCA' },
    { label: 'Conta Investimento', value: 'INVESTIMENTO' },
  ];

  private fb = inject(FormBuilder);
  private messageConfirmationService = inject(MessageConfirmationService);
  private bancoService = inject(BancoService);
  private loadingService = inject(LoadingService);

  private destroy$ = new Subject();

  ngOnInit() {
    this.initializeForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.recebimentoForm = this.fb.group({
      banck: [null, Validators.required],
      agency: ['', [Validators.required, Validators.minLength(4)]],
      account_number: ['', [Validators.required, Validators.minLength(4)]],
      account_type: ['CORRENTE', Validators.required],
      cnpj: [{ value: '', disabled: true }, Validators.required],
    });

    this.bancosFiltrados = [];

    this.loadRecebimentoConfig();

    this.recebimentoForm.valueChanges.subscribe(() => {
      this.updateConfigurationStatus();
    });
  }

  private loadRecebimentoConfig(): void {
    this.loading = true;

    // const userId = this.getUserId();
    // if (userId) {
    //   this.recebimentoService.getRecebimentoByUserId(userId).subscribe({
    //     next: (config) => {
    //       this.recebimentoConfig = config;
    //       this.updateConfigurationStatus();
    //       this.loading = false;
    //     },
    //     error: (error) => {
    //       console.error('Erro ao carregar configuração:', error);
    //       this.recebimentoConfig = null;
    //       this.loading = false;
    //     }
    //   });
    // }
  }

  private updateConfigurationStatus(): void {
    const formValues = this.recebimentoForm.value;
    this.hasConfiguredBank = !!(formValues.banco && formValues.agency && formValues.account_number && formValues.cnpj);
  }

  previewData(): void {
    if (this.recebimentoForm.valid) {
      this.showPreview = true;
    } else {
      this.recebimentoForm.markAllAsTouched();
      this.messageConfirmationService.showWarning(
        'Formulário Incompleto',
        'Por favor, preencha todos os campos obrigatórios antes de visualizar.'
      );
    }
  }

  getSelectedAccountType(): string {
    const selectedValue = this.recebimentoForm.get('account_type')?.value;
    const selectedOption = this.tiposConta.find((tipo) => tipo.value === selectedValue);
    return selectedOption?.label || '';
  }

  onSubmit(): void {
    if (this.recebimentoForm.valid) {
      this.loading = true;

      setTimeout(() => {
        console.log('Dados do formulário:', this.recebimentoForm.value);

        this.messageConfirmationService.showMessage(
          'Configuração Salva',
          'Seus dados bancários foram salvos com sucesso!'
        );

        this.loading = false;
        this.hasConfiguredBank = true;
      }, 2000);
    } else {
      this.recebimentoForm.markAllAsTouched();
      this.messageConfirmationService.showWarning(
        'Formulário Inválido',
        'Por favor, corrija os erros no formulário antes de salvar.'
      );
    }
  }

  filterBancos(event: any): void {
    const query = event.query.toLowerCase();

    if (!Array.isArray(this.bancos)) {
      this.bancosFiltrados = [];
      return;
    }

    this.loading = true;
    this.loadingService.start();

    this.bancoService
      .searchBanks(query, 1, 10)
      .pipe(takeUntil(this.destroy$), take(1))
      .subscribe({
        next: (response: Banco[]) => {
          this.bancosFiltrados = response;
        },
        error: () => {
          this.messageConfirmationService.showError('Erro', 'Ocorreu um erro ao buscar os bancos!');
        },
      })
      .add(() => {
        this.loading = false;
        this.loadingService.done();
      });
  }

  onBankSelect(event: AutoCompleteSelectEvent): void {
    const bank = event.value as Banco;
    this.bancoSelecionado = bank;
    this.recebimentoForm.patchValue({ bank: bank });
  }

  getBankDisplay(bank: Banco): string {
    if (!bank) return '';
    return bank.code ? `${bank.code} - ${bank.name}` : bank.name;
  }

  clearForm(): void {
    this.recebimentoForm.reset();
    this.recebimentoForm.patchValue({
      account_type: 'CORRENTE',
      banco: null,
    });
    this.bancoSelecionado = null;
    this.hasConfiguredBank = false;
  }

  validateCNPJ(): boolean {
    const cnpj = this.recebimentoForm?.get('cnpj')?.value;
    if (!cnpj) return false;

    return cnpj.replace(/\D/g, '').length === 14;
  }

  isDadosBancariosConfigurado(): boolean {
    return !!(this.bank?.value && this.agency?.value && this.account_number?.value && this.cnpj?.value);
  }

  isCnpjVerificado(): boolean {
    return this.recebimentoConfig?.status === 'VERIFIED';
  }

  get bank() {
    return this.recebimentoForm?.get('bank');
  }

  get agency() {
    return this.recebimentoForm?.get('agency');
  }

  get account_number() {
    return this.recebimentoForm?.get('account_number');
  }

  get account_type() {
    return this.recebimentoForm?.get('account_type');
  }

  get cnpj() {
    return this.recebimentoForm?.get('cnpj');
  }
}

