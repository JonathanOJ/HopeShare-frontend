import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-failure',
  templateUrl: './failure.component.html',
  styleUrls: ['./failure.component.css'],
})
export class FailureComponent {
  constructor(private router: Router) {}

  goToHome(): void {
    this.router.navigate(['/hopeshare/home']);
  }

  tryAgain(): void {
    this.router.navigate(['/hopeshare/home']);
  }
}

