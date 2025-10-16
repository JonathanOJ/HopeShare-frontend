import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ValidacaoUsuario } from '../models/validacao-usuario';

@Injectable({
  providedIn: 'root',
})
export class ValidacaoUsuarioService {
  private readonly URL_API = environment.api_url.concat('/validation');

  constructor(private httpClient: HttpClient) {}

  save(formData: FormData): Observable<string> {
    return this.httpClient.post<string>(`${this.URL_API}`, formData);
  }

  getValidationByUserId(user_id: string): Observable<ValidacaoUsuario> {
    return this.httpClient.get<ValidacaoUsuario>(`${this.URL_API}/${user_id}`);
  }

  getValidacoesPendentes(user_id: string): Observable<ValidacaoUsuario[]> {
    return this.httpClient.get<ValidacaoUsuario[]>(`${this.URL_API}/admin/pending-validations/${user_id}`);
  }

  updateValidationAdmin(payload: any): Observable<any> {
    return this.httpClient.patch<any>(`${this.URL_API}/admin/${payload.user_id}/update`, payload);
  }
}

