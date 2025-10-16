import { inject, Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AuthUser } from '../models/auth';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private keyCrypt = '##HopeShare##';

  private cookieName = 'userAuth';

  private cookieService = inject(CookieService);

  setAuthResponse(authResponse: AuthUser): void {
    const value = JSON.stringify(authResponse);
    const encrypted = this.encrypt(value);
    this.cookieService.set(this.cookieName, encrypted);
  }

  getAuthResponse(): AuthUser | null {
    const auth = this.cookieService.get(this.cookieName);

    if (!auth) {
      return null;
    }

    try {
      const decrypted = this.decrypt(auth);
      return JSON.parse(decrypted) as AuthUser;
    } catch (error) {
      console.error('Erro ao descriptografar o cookie de autenticação:', error);
      return null;
    }
  }

  encrypt(value: string): string {
    return CryptoJS.AES.encrypt(value, this.keyCrypt).toString();
  }

  decrypt(value: string): string {
    const bytes = CryptoJS.AES.decrypt(value, this.keyCrypt);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  delete() {
    this.cookieService.deleteAll(this.cookieName);

    window.location.replace('hopeshare/home');
  }

  logout(): void {
    this.delete();
  }
}
