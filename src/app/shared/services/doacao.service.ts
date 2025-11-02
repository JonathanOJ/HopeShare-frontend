import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Doacao } from '../models/doacao.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DoacaoService {
  private readonly URL_API = environment.api_url.concat('/donations');

  constructor(private httpClient: HttpClient) {}

  create(body: any): Observable<string> {
    return this.httpClient.post<string>(`${this.URL_API}/create`, body);
  }

  getUserDonations(user_id: string): Observable<Doacao[]> {
    return this.httpClient.get<Doacao[]>(`${this.URL_API}/${user_id}/user`);
  }

  getCampanhaDonations(campanha_id: string): Observable<Doacao[]> {
    return this.httpClient.get<Doacao[]>(`${this.URL_API}/${campanha_id}/campanha`);
  }

  refundDonation(payment_id: string): Observable<any> {
    return this.httpClient.post<any>(`${this.URL_API}/refund/${payment_id}`, {});
  }
}

