import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Relatorio } from '../models/relatorio.model';

@Injectable({
  providedIn: 'root',
})
export class RelatorioService {
  private readonly URL_API = environment.api_url.concat('/relatorio');

  constructor(private httpClient: HttpClient) {}

  getRelatoriosByUser(user_id: string): Observable<Relatorio[]> {
    return this.httpClient.get<Relatorio[]>(`${this.URL_API}/user/${user_id}`);
  }

  gerarRelatorioFinanceiro(campanha_id: string, type: 'CONTABIL' | 'FINANCEIRO'): Observable<Relatorio> {
    const body = {
      type,
    };
    return this.httpClient.post<Relatorio>(`${this.URL_API}/${campanha_id}/export`, body);
  }

  deleteRelatorio(relatorio_id: string): Observable<any> {
    return this.httpClient.delete(`${this.URL_API}/${relatorio_id}`);
  }
}

