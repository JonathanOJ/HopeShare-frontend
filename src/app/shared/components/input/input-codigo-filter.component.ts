import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-codigo-filter',
  template: `
    <input
      type="text"
      pInputText
      [placeholder]="placeHolder"
      pKeyFilter="pint"
      (keyup.enter)="onKeyUp($event.target)"
    />
  `,
})
export class FilterInputComponent {
  @Output() filter: EventEmitter<string> = new EventEmitter<string>();
  @Input() placeHolder: string = 'Código';

  onKeyUp(target: any) {
    this.filter.emit(target.value);
  }
}
