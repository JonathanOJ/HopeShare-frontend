import { ConfirmationService, MessageService } from 'primeng/api';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MessageConfirmationService {
  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  public confirmWarning(param: { message: string; accept?: () => void; reject?: () => void; acceptLabel?: string }) {
    const confirmationConfig: any = {
      message: param.message,
      header: 'Atenção',
      icon: 'pi pi-exclamation-triangle',
      rejectVisible: false,
      acceptLabel: param.acceptLabel || 'OK',
    };

    if (param.accept) {
      confirmationConfig.accept = param.accept;
    }

    if (param.reject) {
      confirmationConfig.rejectLabel = 'Não';
      confirmationConfig.rejectVisible = true;
      confirmationConfig.reject = param.reject;
    }

    this.confirmationService.confirm(confirmationConfig);
  }

  public confirmError(message: string, target?: any, accept?: () => void) {
    const confirmationConfig: any = {
      message: message,
      icon: 'pi pi-times',
      acceptLabel: 'OK',
      rejectVisible: false,
    };

    if (target) {
      confirmationConfig.target = target;
    }

    if (accept) {
      confirmationConfig.accept = accept;
    }

    this.confirmationService.confirm(confirmationConfig);
  }

  public confirmSuccess(param: { message: string; accept?: () => void; reject?: () => void }) {
    const confirmationConfig: any = {
      message: param.message,
      icon: 'pi pi-check',
      acceptLabel: 'OK',
      rejectVisible: false,
    };

    if (param.accept) {
      confirmationConfig.accept = param.accept;
    }

    if (param.reject) {
      confirmationConfig.reject = param.reject;
    }

    this.confirmationService.confirm(confirmationConfig);
  }

  public confirmQuestion(param: { header?: string; message: string; accept: () => void; reject?: () => void }) {
    const confirmationConfig: any = {
      message: param.message,
      icon: 'pi pi-question-circle',
      acceptLabel: 'Sim',
      accept: param.accept,
    };

    if (param.header) {
      confirmationConfig.header = param.header;
    }

    if (param.reject) {
      confirmationConfig.rejectLabel = 'Não';
      confirmationConfig.reject = param.reject;
    }

    this.confirmationService.confirm(confirmationConfig);
  }

  public showMessage(title: string, message: string) {
    this.messageService.add({ severity: 'success', summary: title, detail: message });
  }

  public showWarning(title: string, message: string) {
    this.messageService.add({ severity: 'warn', summary: title, detail: message });
    console.log('Warning: ', title, message);
  }

  public showError(title: string, message: string) {
    this.messageService.add({ severity: 'error', summary: title, detail: message });
  }
}
