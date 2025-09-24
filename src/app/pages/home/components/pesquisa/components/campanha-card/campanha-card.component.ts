import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Campanha } from '../../../../../../shared/models/campanha.model';

@Component({
  selector: 'app-campanha-card',
  templateUrl: './campanha-card.component.html',
  styleUrl: './campanha-card.component.css',
})
export class CampanhaCardComponent {
  @Input() campanha: Campanha | null = null;
  @Output() onReport = new EventEmitter<Campanha>();
  @Output() onComment = new EventEmitter<Campanha>();

  onReportClick(event: Event) {
    event.stopPropagation(); // Evita que o click no card seja acionado
    if (this.campanha) {
      this.onReport.emit(this.campanha);
    }
  }

  onCommentClick(event: Event) {
    event.stopPropagation(); // Evita que o click no card seja acionado
    if (this.campanha) {
      this.onComment.emit(this.campanha);
    }
  }
}

