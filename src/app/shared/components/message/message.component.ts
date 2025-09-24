import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-message-component',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit {
  mensagem: string = '';

  constructor(private config: DynamicDialogConfig) {}

  ngOnInit(): void {
    this.mensagem = this.config.data.mensagem;
  }
}
