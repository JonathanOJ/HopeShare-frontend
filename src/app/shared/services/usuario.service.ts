import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthUser, InfoCampanhasUsuario } from '../models/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private readonly URL_API = environment.api_url.concat('/users');

  constructor(private httpClient: HttpClient) {}

  updateUserPostsCreated(id: string) {
    return this.httpClient.get(`${this.URL_API}/updateUserCampanhasCreated/${id}`);
  }

  getUserByEmail(email: string) {
    return this.httpClient.get(`${this.URL_API}/findByEmail/${email}`);
  }

  getUserById(user_id: string) {
    return this.httpClient.get(`${this.URL_API}/findById/${user_id}`);
  }

  saveUser(user: AuthUser) {
    return this.httpClient.post<AuthUser>(`${this.URL_API}/save`, user);
  }

  signIn(user: AuthUser) {
    return this.httpClient.post<AuthUser>(`${this.URL_API}/signIn`, user);
  }

  getDetailsCampanhasByUsuarioId(user_id: string): Observable<InfoCampanhasUsuario> {
    return this.httpClient.get<InfoCampanhasUsuario>(`${this.URL_API}/getDetailsCampanhasByUsuarioId/${user_id}`);
  }
}

