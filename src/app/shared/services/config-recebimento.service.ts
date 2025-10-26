import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Recebimento } from '../models/recebimento.model';

@Injectable({
  providedIn: 'root',
})
export class ConfigRecebimentoService {
  private readonly URL_API = environment.api_url.concat('/config/receipt');

  constructor(private httpClient: HttpClient) {}

  save(body: Recebimento) {
    return this.httpClient.post(`${this.URL_API}`, body);
  }

  getConfigRecebimentoByUserId(user_id: string): Observable<Recebimento> {
    return this.httpClient.get<Recebimento>(`${this.URL_API}/${user_id}`);
  }
}

