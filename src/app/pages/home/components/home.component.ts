import { Component, inject, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MessageService } from 'primeng/api';
import { AuthUser } from '../../../shared/models/auth';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'h-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [MessageService],
})
export class HomeComponent implements OnInit {
  isMobile: boolean = false;
  userSession: AuthUser | null = null;

  messagesInicialHome = [
    {
      title: 'Escolha',
      detail: 'Escolha uma campanha que deseja ajudar',
    },
    {
      title: 'Doe',
      detail: "O valor é você quem decide, e ele vai <span class='text-[#3b82f6]'>todo</span> para quem escolher",
    },
    {
      title: 'Aproveite',
      detail: 'Doar gera felicidade para você e para quem recebeu.',
    },
    {
      title: 'Acompanhe',
      detail: 'Fique ligado, acompanhe se a campanha alcançou o objetivo.',
    },
  ];

  private breakpointObserver = inject(BreakpointObserver);
  private authService = inject(AuthService);

  ngOnInit() {
    this.handleWindowSize();

    this.userSession = this.authService.getAuthResponse() || null;

    if (this.userSession) {
      this.userSession.is_admin = true;

      this.authService.setAuthResponse(this.userSession);
    }
  }

  handleWindowSize() {
    this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small]).subscribe((result) => {
      this.isMobile = result.matches;
    });
  }
}

