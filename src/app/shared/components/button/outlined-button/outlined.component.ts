/* eslint-disable @angular-eslint/no-output-on-prefix */
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-outlined-button',
  templateUrl: './outlined.component.html',
  styleUrls: ['./outlined.component.scss'],
})
export class OutlinedComponent {
  @Input() label: string = 'Salvar';
  @Input() disabled: boolean = false;
  @Output() onClick = new EventEmitter();

  click($event: MouseEvent) {
    this.onClick.emit($event);
  }
}
