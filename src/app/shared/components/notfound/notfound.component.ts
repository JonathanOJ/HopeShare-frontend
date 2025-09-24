import { Component, inject, OnInit } from '@angular/core';
import { LayoutService } from '../../services/layout.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notfound',
  templateUrl: './notfound.component.html',
})
export class NotfoundComponent {
  layoutService = inject(LayoutService);
  router = inject(Router);

  title = '404 Not Found';

  redirectToHome() {
    this.router.navigate(['hopeshare/home']);
  }
}
