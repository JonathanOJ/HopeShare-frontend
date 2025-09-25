import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-recebimento',
  templateUrl: './recebimento.component.html',
  styleUrls: ['./recebimento.component.css'],
})
export class RecebimentoComponent implements OnInit {
  recebimentoForm!: FormGroup;

  tiposConta = [
    { label: 'Conta Corrente', value: 'corrente' },
    { label: 'Conta Poupança', value: 'poupanca' },
  ];

  fb = inject(FormBuilder);

  ngOnInit(): void {
    this.recebimentoForm = this.fb.group({
      banco: ['', Validators.required],
      agencia: ['', [Validators.required, Validators.minLength(4)]],
      contaBancaria: ['', Validators.required],
      tipoConta: ['corrente', Validators.required],
      cnpj: ['', [Validators.required, Validators.pattern(/^\d{14}$/)]],
    });
  }

  onSubmit() {
    if (this.recebimentoForm.valid) {
      console.log('Dados do formulário:', this.recebimentoForm.value);
    } else {
      this.recebimentoForm.markAllAsTouched();
    }
  }
}

