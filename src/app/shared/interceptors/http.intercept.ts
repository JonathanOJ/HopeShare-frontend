import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { catchError, Observable, of, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class HttpIntercept implements HttpInterceptor {
  constructor(
    private confirmationService: ConfirmationService,
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let headers = request.headers;

    if (!(request.body instanceof FormData) && !headers.has('Content-Type')) {
      headers = headers.set('Content-Type', 'application/json');
    }

    const urlPermittedWithoutLogin = ['/user/save', '/save/login', '/campanha/search', '/assets/mdi.svg'];

    const authResponse = this.authService.getAuthResponse();

    const isPublic = urlPermittedWithoutLogin.some((url) => request.url.endsWith(url));

    if (!authResponse && !isPublic) {
      this.router.navigate(['/login']);
    }

    request = request.clone({
      headers: headers,
    });

    return next.handle(request).pipe(catchError((x) => this.handleAuthError(x)));
  }

  private handleAuthError(err: HttpErrorResponse): Observable<any> {
    if (err.status === 422) {
      this.confirmationService.confirm({
        header: 'Atenção',
        message: err.error.errorFields.map((e: any) => e.error).join('\n'),
        icon: 'pi pi-times',
        acceptLabel: 'OK',
        rejectVisible: false,
      });
      return of();
    }

    if (err.status === 0 || err.statusText === 'Unknown Error') {
      this.confirmationService.confirm({
        header: 'Atenção',
        message: 'Servidor indisponível',
        icon: 'pi pi-times',
        acceptLabel: 'OK',
        rejectVisible: false,
      });
      return of();
    }

    return throwError(() => err);
  }
}
