import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { BANCOS, type Banco } from '../../../shared/constants/bancos';
import { AutoCompleteSelectEvent } from 'primeng/autocomplete';
import { Recebimento } from '../../../shared/models/recebimento.model';

@Component({
  selector: 'app-recebimento',
  templateUrl: './recebimento.component.html',
  styleUrls: ['./recebimento.component.css'],
})
export class RecebimentoComponent implements OnInit {
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
  private messageService = inject(MessageService);

  async ngOnInit(): Promise<void> {
    await this.loadBancos();
    this.initializeForm();
  }

  private async loadBancos(): Promise<void> {
    try {
      const bancosData = await import('../../../shared/constants/bancos-list.json');
      const bancosRaw = Array.isArray(bancosData.default)
        ? bancosData.default
        : Array.isArray(bancosData)
          ? bancosData
          : [];

      this.bancos = bancosRaw;

      this.bancosFiltrados = [...this.bancos];
    } catch (error) {
      this.bancos = [];
      this.bancosFiltrados = [];
    }
  }

  private initializeForm(): void {
    this.recebimentoForm = this.fb.group({
      banco: [null, Validators.required],
      agency: ['', [Validators.required, Validators.minLength(4)]],
      account_number: ['', [Validators.required, Validators.minLength(4)]],
      account_type: ['CORRENTE', Validators.required],
      cnpj: [{ value: '', disabled: true }, Validators.required],
    });

    this.bancosFiltrados = [];

    this.loadRecebimentoConfig();

    console.log('chamando initform');

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
    //       this.populateFormWithConfig();
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

    const recebimentoSimulado: Recebimento = {
      recebimento_id: '12345',
      banco: {
        code: 237,
        name: 'Bradesco',
        fullName: 'Banco Bradesco S.A.',
      },
      agency: '12345',
      account_number: '987654',
      account_type: 'CORRENTE',
      cnpj: '12345678000190',
      created_at: new Date('2024-01-15'),
      updated_at: new Date('2024-10-01'),
      account_verified: true,
      status: 'VERIFIED',
    };

    this.recebimentoConfig = recebimentoSimulado;
    this.recebimentoForm.patchValue({
      banco: this.recebimentoConfig.banco,
      agency: this.recebimentoConfig!.agency,
      account_number: this.recebimentoConfig!.account_number,
      account_type: this.recebimentoConfig!.account_type,
      cnpj: this.recebimentoConfig!.cnpj,
    });

    console.log(this.recebimentoForm.value);

    this.updateConfigurationStatus();
    this.loading = false;
  }

  private getUserId(): string | null {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    return user.id || null;
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
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulário Incompleto',
        detail: 'Por favor, preencha todos os campos obrigatórios antes de visualizar.',
      });
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

        this.messageService.add({
          severity: 'success',
          summary: 'Configuração Salva',
          detail:
            'Seus dados bancários foram salvos com sucesso! As alterações podem levar até 24h para entrar em vigor.',
        });

        this.loading = false;
        this.hasConfiguredBank = true;
      }, 2000);
    } else {
      this.recebimentoForm.markAllAsTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Formulário Inválido',
        detail: 'Por favor, corrija os erros no formulário antes de salvar.',
      });
    }
  }

  filterBancos(event: any): void {
    const query = event.query.toLowerCase();

    if (!Array.isArray(this.bancos)) {
      this.bancosFiltrados = [];
      return;
    }

    this.bancosFiltrados = this.bancos.filter(
      (banco) =>
        banco.name.toLowerCase().includes(query) ||
        banco.fullName.toLowerCase().includes(query) ||
        (banco.code && banco.code.toString().includes(query))
    );
  }

  onBancoSelect(event: AutoCompleteSelectEvent): void {
    const banco = event.value as Banco;
    this.bancoSelecionado = banco;
    this.recebimentoForm.patchValue({ banco });
    console.log('Banco selecionado:', banco);
  }

  getBancoDisplay(banco: Banco): string {
    if (!banco) return '';
    return banco.code ? `${banco.code} - ${banco.name}` : banco.name;
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

  get banco() {
    return this.recebimentoForm?.get('banco');
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

  // Métodos para verificar status baseado na configuração Recebimento
  isDadosBancariosConfigurado(): boolean {
    return !!(
      this.recebimentoConfig?.banco &&
      this.recebimentoConfig?.agency &&
      this.recebimentoConfig?.account_number &&
      this.recebimentoConfig?.cnpj
    );
  }

  isCnpjVerificado(): boolean {
    return this.recebimentoConfig?.account_verified === true;
  }

  getStatusRecebimento(): 'ATIVO' | 'INATIVO' | 'PENDENTE' {
    if (!this.recebimentoConfig) return 'INATIVO';

    if (this.recebimentoConfig.status === 'VERIFIED' && this.recebimentoConfig.account_verified) {
      return 'ATIVO';
    } else if (this.recebimentoConfig.status === 'PENDING') {
      return 'PENDENTE';
    } else {
      return 'INATIVO';
    }
  }

  getStatusSeverity(status: string): 'success' | 'warning' | 'danger' | 'info' {
    switch (status) {
      case 'ATIVO':
      case 'Configurado':
      case 'Verificado':
        return 'success';
      case 'PENDENTE':
      case 'Não Configurado':
        return 'warning';
      case 'INATIVO':
      case 'Rejeitado':
        return 'danger';
      default:
        return 'info';
    }
  }
}

