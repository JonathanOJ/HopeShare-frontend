import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoadingService } from '../../services/loading.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent implements OnInit, OnDestroy {
  visible = false;
  message: string = 'Carregando...';

  private subscriptions = new Subscription();

  constructor(private loadingService: LoadingService) {}

  ngOnInit(): void {
    // Usar subscription para evitar memory leaks
    this.subscriptions.add(
      this.loadingService.getEnableObservable().subscribe((enable: boolean) => {
        this.visible = enable;
        console.log('Loading visibility changed:', enable); // Debug log
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
