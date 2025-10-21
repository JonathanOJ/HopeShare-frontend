import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-step-descricao',
  templateUrl: './step-descricao.component.html',
  styleUrl: './step-descricao.component.css',
})
export class StepDescricaoComponent {
  @Input() activeStep: number = 0;
  @Input() totalSteps: number = 5;
  @Input() campanhaForm: FormGroup | null = null;
  @Output() haveAddressChange: EventEmitter<void> = new EventEmitter();
  @Output() onCancel: EventEmitter<void> = new EventEmitter();
  @ViewChild('header', { static: true }) headerTemplate!: TemplateRef<any>;
  @ViewChild('content', { static: true }) contentTemplate!: TemplateRef<any>;

  imagemSelecionada: File | null = null;

  onUpload(event: any) {
    try {
      const file = event.files[0];

      if (!file) return;

      if (!file.type.startsWith('image/')) {
        return;
      }

      if (file.size > 5000000) {
        return;
      }

      this.imagemSelecionada = file;
      this.new_file_image?.setValue(file);
    } catch (error) {
      console.error('Erro ao processar imagem:', error);
    }
  }

  removerImagem() {
    this.imagemSelecionada = null;
    this.new_file_image?.setValue('');
  }

  handleHaveAddressChange() {
    this.haveAddressChange.emit();
  }

  validateDescricaoStep(): boolean {
    return !(this.title?.valid && this.description?.valid);
  }

  get description() {
    return this.campanhaForm?.get('description');
  }

  get title() {
    return this.campanhaForm?.get('title');
  }

  get new_file_image() {
    return this.campanhaForm?.get('new_file_image');
  }

  get request_emergency() {
    return this.campanhaForm?.get('request_emergency');
  }

  get have_address() {
    return this.campanhaForm?.get('have_address');
  }

  get image() {
    return this.campanhaForm?.get('image');
  }
}

