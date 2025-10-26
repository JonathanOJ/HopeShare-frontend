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
    return this.httpClient.get<Relatorio[]>(`${this.URL_API}/${user_id}`);
  }
}

