import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { AuthUser, InfoCampanhasUsuario, TipoUsuario } from '../../../../../shared/models/auth';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { UsuarioService } from '../../../../../shared/services/usuario.service';

@Component({
  selector: 'app-hero-logged',
  templateUrl: './hero-logged.component.html',
  styleUrl: './hero-logged.component.css',
})
export class HeroLoggedComponent implements OnInit, OnDestroy {
  @Input() isMobile: boolean = false;
  @Input() userSession!: AuthUser;

  userIsCompany: boolean = false;

  animatedTotalDonated = 0;

  infoCampanhasUsuario: InfoCampanhasUsuario | null = null;

  router = inject(Router);
  usuarioService = inject(UsuarioService);

  private destroy$ = new Subject();

  ngOnInit(): void {
    this.userIsCompany = this.userSession?.type_user === TipoUsuario.EMPRESA;

    this.getInfoCampanhasByuser_id(this.userSession.user_id);
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  getInfoCampanhasByuser_id(user_id: string) {
    this.usuarioService
      .getDetailsCampanhasByUsuarioId(user_id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response) {
            this.infoCampanhasUsuario = response;

            this.animateCounterRaf('animatedTotalDonated', response.total_donated, 2000);
          }
        },
        error: (error) => {
          console.error('Error fetching campaign info:', error);
        },
      });
  }

  animateCounterRaf(prop: 'animatedTotalDonated', endValue: number, duration: number) {
    const startTime = performance.now();

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      this[prop] = Math.floor(progress * endValue);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        this[prop] = endValue;
      }
    };

    requestAnimationFrame(step);
  }

  redirectTo(route: string) {
    this.router.navigateByUrl(`hopeshare/${route}`);
  }

  redirectSmoothTo(idElement: string) {
    const element = document.getElementById(idElement);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

