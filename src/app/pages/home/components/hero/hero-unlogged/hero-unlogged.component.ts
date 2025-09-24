import { Component, inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hero-unlogged',
  templateUrl: './hero-unlogged.component.html',
  styleUrl: './hero-unlogged.component.css',
})
export class HeroUnloggedComponent implements OnInit {
  @Input() isMobile: boolean = false;

  private router = inject(Router);

  tagsMessages = [
    {
      title: 'Registro grátis',
    },
    {
      title: 'Sem taxas',
    },
    {
      title: 'Rápido e prático',
    },
  ];

  ngOnInit(): void {
    if (this.isMobile) {
      this.tagsMessages = this.tagsMessages.concat(this.tagsMessages);
    }
  }

  redirectToRegister() {
    this.router.navigate(['hopeshare/camapanhas/register']);
  }
}

