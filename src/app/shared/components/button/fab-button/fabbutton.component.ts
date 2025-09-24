import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-fabbutton',
  templateUrl: './fabbutton.component.html',
  styleUrls: ['./fabbutton.component.scss'],
})
export class FabbuttonComponent implements OnInit {
  @Output() onClick = new EventEmitter();

  ngOnInit(): void {}

  click($event: MouseEvent) {
    this.onClick.emit($event);
  }
}
