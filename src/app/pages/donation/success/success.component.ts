import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css'],
})
export class SuccessComponent implements OnInit {
  countdown: number = 5;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.startCountdown();
  }

  startCountdown(): void {
    const interval = setInterval(() => {
      this.countdown--;
      if (this.countdown === 0) {
        clearInterval(interval);
        this.goToHome();
      }
    }, 1000);
  }

  goToHome(): void {
    this.router.navigate(['/hopeshare/home']);
  }
}

