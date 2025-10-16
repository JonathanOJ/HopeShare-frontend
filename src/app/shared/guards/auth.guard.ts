import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TipoUsuario } from '../models/auth';
import { MessageConfirmationService } from '../services/message-confirmation.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(
    private authService: AuthService,
    private router: Router,
    private messageConfirmationService: MessageConfirmationService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const authResponse = this.authService.getAuthResponse();

    if (!authResponse) {
      this.router.navigate(['/login']);
      return false;
    }

    const requiredRole: TipoUsuario | undefined = route.data['role'];
    const adminOnly: boolean = route.data['adminOnly'];

    if (adminOnly && !authResponse.admin) {
      this.messageConfirmationService.showWarning('Atenção', 'Acesso restrito para administradores!');
      this.router.navigate(['/hopeshare/home']);
      return true;
    }

    if (requiredRole && authResponse.type_user !== requiredRole) {
      this.messageConfirmationService.showWarning('Atenção', 'Você não tem permissão para acessar essa página!');
      this.router.navigate(['/hopeshare/home']);
      return false;
    }

    return true;
  }
}
