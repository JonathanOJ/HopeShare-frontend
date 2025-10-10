import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Doacao } from '../models/doacao.model';
import { Observable } from 'rxjs';
import { Banco } from '../models/banco.model';

@Injectable({
  providedIn: 'root',
})
export class BancoService {
  private readonly URL_API = environment.api_url.concat('/banks');

  constructor(private httpClient: HttpClient) {}

  searchBanks(param: string, page: number, itemsPerPage: number): Observable<Banco[]> {
    return this.httpClient.post<Banco[]>(`${this.URL_API}/search`, { search: param, page, itemsPerPage });
  }

  getBankById(bank_id: string): Observable<Banco> {
    return this.httpClient.get<Banco>(`${this.URL_API}/${bank_id}`);
  }
}

