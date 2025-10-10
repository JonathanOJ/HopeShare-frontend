import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ValidationUser } from '../models/validacao-usuario';

@Injectable({
  providedIn: 'root',
})
export class ValidationUserService {
  private readonly URL_API = environment.api_url.concat('/validation');

  constructor(private httpClient: HttpClient) {}

  save(validationUser: ValidationUser): Observable<string> {
    return this.httpClient.post<string>(`${this.URL_API}`, validationUser);
  }

  getValidationByUserId(user_id: string): Observable<ValidationUser> {
    return this.httpClient.get<ValidationUser>(`${this.URL_API}/${user_id}`);
  }

  updateValidationAdmin(user_id: string, status: string, observation: string, validation_id: string): Observable<any> {
    return this.httpClient.patch<any>(`${this.URL_API}/admin/${user_id}/update`, {
      status,
      observation,
      validation_id,
    });
  }
}

