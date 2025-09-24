import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [],
})
export class AppComponent implements OnInit {
  loginRoute: boolean = false;

  router = inject(Router);

  ngOnInit(): void {
    this.loginRoute = this.router.url.includes('login');

    this.router.events.subscribe(() => {
      this.loginRoute = this.router.url.includes('login');
    });
  }
}

