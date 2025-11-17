import { Component, inject, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AutoCompleteSelectEvent } from 'primeng/autocomplete';
import { Recebimento } from '../../../shared/models/recebimento.model';
import { AuthUser } from '../../../shared/models/auth';
import { Banco } from '../../../shared/models/banco.model';
import { BancoService } from '../../../shared/services/banco.service';
import { takeUntil, take, Subject } from 'rxjs';
import { MessageConfirmationService } from '../../../shared/services/message-confirmation.service';
import { ConfigRecebimentoService } from '../../../shared/services/config-recebimento.service';

@Component({
  selector: 'app-recebimento',
  templateUrl: './recebimento.component.html',
  styleUrls: ['./recebimento.component.css'],
})
export class RecebimentoComponent implements OnChanges, OnDestroy {
  @Input() user: AuthUser | null = null;
  @Input() recebimentoConfig: Recebimento | null = null;

  recebimentoForm!: FormGroup;
  loading = false;

  showPreview = false;
  hasConfiguredBank = false;

  bancos: Banco[] = [];
  bancosFiltrados: Banco[] = [];
  bancoSelecionado: Banco | null = null;

  tiposConta = [
    { label: 'Conta Corrente', value: 'CORRENTE' },
    { label: 'Conta Poupança', value: 'POUPANCA' },
    { label: 'Conta Investimento', value: 'INVESTIMENTO' },
  ];

  private fb = inject(FormBuilder);
  private messageConfirmationService = inject(MessageConfirmationService);
  private bancoService = inject(BancoService);
  private configRecebimentoService = inject(ConfigRecebimentoService);

  private destroy$ = new Subject();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['recebimentoConfig'] && this.recebimentoConfig) {
      this.initializeForm(this.recebimentoConfig);
      this.updateConfigurationStatus();
    } else {
      this.initializeForm();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  private initializeForm(recebimentoConfig: Recebimento | null = null): void {
    this.recebimentoForm = this.fb.group({
      bank: [recebimentoConfig?.bank || null, Validators.required],
      agency: [recebimentoConfig?.agency || '', [Validators.required, Validators.minLength(4)]],
      account_number: [recebimentoConfig?.account_number || '', [Validators.required, Validators.minLength(4)]],
      account_type: [recebimentoConfig?.account_type || 'CORRENTE', Validators.required],
      pix_key: [recebimentoConfig?.pix_key || ''], // Campo opcional
      cnpj: [{ value: this.user?.cnpj || '', disabled: true }, Validators.required],
      user_id: [this.user?.user_id || '', Validators.required],
    });

    this.bancosFiltrados = [];

    this.recebimentoForm.valueChanges.subscribe(() => {
      this.updateConfigurationStatus();
    });
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
    const selectedValue = this.account_type?.value;
    const selectedOption = this.tiposConta.find((tipo) => tipo.value === selectedValue);
    return selectedOption?.label || '';
  }

  onSubmit(): void {
    if (this.recebimentoForm.invalid) {
      this.recebimentoForm.markAllAsTouched();
      this.messageConfirmationService.showWarning(
        'Formulário Inválido',
        'Por favor, corrija os erros no formulário antes de salvar.'
      );
      return;
    }

    this.loading = true;

    this.configRecebimentoService
      .save(this.recebimentoForm.value)
      .pipe(takeUntil(this.destroy$), take(1))
      .subscribe({
        next: () => {
          this.messageConfirmationService.showMessage(
            'Configuração Salva',
            'Seus dados bancários foram salvos com sucesso!'
          );
          this.hasConfiguredBank = true;
        },
        error: (error) => {
          const errorMessage = error?.error?.message || 'Ocorreu um erro ao salvar a configuração.';
          this.messageConfirmationService.showError('Erro', errorMessage);
        },
      })
      .add(() => {
        this.loading = false;
      });
  }

  filterBancos(event: any): void {
    const query = event.query.toLowerCase();

    if (!Array.isArray(this.bancos)) {
      this.bancosFiltrados = [];
      return;
    }

    this.loading = true;
    this.bancoService
      .searchBanks(query, 10)
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

  get pix_key() {
    return this.recebimentoForm?.get('pix_key');
  }

  get cnpj() {
    return this.recebimentoForm?.get('cnpj');
  }
}

