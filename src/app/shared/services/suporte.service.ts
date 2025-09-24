import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthUser } from '../models/auth';

@Injectable({
  providedIn: 'root',
})
export class SuporteService {
  private readonly URL_API = environment.api_url.concat('/suporte');

  constructor(private httpClient: HttpClient) {}

  sendEmailSupport(body: { user: AuthUser; subject: string; message: string }) {
    return this.httpClient.post(`${this.URL_API}`, body);
  }
}

