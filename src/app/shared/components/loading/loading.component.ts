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
    this.subscriptions.add(
      this.loadingService.getEnableObservable().subscribe((enable: boolean) => {
        this.visible = enable;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
