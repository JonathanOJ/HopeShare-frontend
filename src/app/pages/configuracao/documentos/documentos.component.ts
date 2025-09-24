import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-documentos',
  templateUrl: './documentos.component.html',
  styleUrls: ['./documentos.component.css'],
})
export class DocumentosComponent implements OnInit {
  empresaForm!: FormGroup;

  fb = inject(FormBuilder);

  ngOnInit(): void {
    this.empresaForm = this.fb.group({
      razaoSocial: ['', Validators.required],
      cnpj: ['', [Validators.required, Validators.pattern(/^\d{14}$/)]],
      endereco: ['', Validators.required],
      documentos: [null, Validators.required],
    });
  }

  onUpload(event: any) {
    console.log('Arquivos enviados:', event.files);
    this.empresaForm.patchValue({ documentos: event.files });
  }

  onSubmit() {
    if (this.empresaForm.valid) {
      console.log('Dados da empresa:', this.empresaForm.value);
      // Aqui você pode enviar os dados e documentos para o backend
    } else {
      this.empresaForm.markAllAsTouched();
    }
  }
}

