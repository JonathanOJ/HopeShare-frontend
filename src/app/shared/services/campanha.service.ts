import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { UserDonatedModel } from '../models/userDonated.model';
import { Campanha } from '../models/campanha.model';
import { Comentario, CreateComentarioRequest } from '../models/comentario.model';
import { CreateDenunciaRequest } from '../models/denuncia.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CampanhaService {
  private readonly URL_API = environment.api_url.concat('/campanha');

  constructor(private httpClient: HttpClient) {}

  searchCampanha(body: any) {
    return this.httpClient.post(`${this.URL_API}/search`, body);
  }

  findCampanhaById(id: string) {
    return this.httpClient.get(`${this.URL_API}/${id}`);
  }

  findCampanhaByUser(id: string) {
    Observable<Campanha[]>;
    return this.httpClient.get<Campanha[]>(`${this.URL_API}/findAllByUser/${id}`);
  }

  saveCampanha(campanha: FormData) {
    return this.httpClient.post(`${this.URL_API}/save`, campanha);
  }

  deleteCampanha(id: string) {
    return this.httpClient.delete(`${this.URL_API}/${id}`);
  }

  donateCampanha(body: any) {
    return this.httpClient.post(`${this.URL_API}/donate`, body);
  }

  reportCampanha(campanhaId: string, reportData: CreateDenunciaRequest): Observable<any> {
    return this.httpClient.post(`${this.URL_API}/${campanhaId}/report`, reportData);
  }

  addComment(campanhaId: string, commentData: CreateComentarioRequest): Observable<Comentario> {
    return this.httpClient.post<Comentario>(`${this.URL_API}/${campanhaId}/comments`, commentData);
  }

  getComments(campanhaId: string): Observable<Comentario[]> {
    return this.httpClient.get<Comentario[]>(`${this.URL_API}/${campanhaId}/comments`);
  }

  deleteComment(campanhaId: string, commentId: string): Observable<any> {
    return this.httpClient.delete(`${this.URL_API}/${campanhaId}/comments/${commentId}`);
  }

  getDenuncias(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.URL_API}/admin/reports`);
  }

  updateDenunciaStatus(denunciaId: string, status: string): Observable<any> {
    return this.httpClient.patch(`${this.URL_API}/admin/reports/${denunciaId}/status`, { status });
  }

  suspendCampanha(campanhaId: string, reason: string): Observable<any> {
    return this.httpClient.patch(`${this.URL_API}/admin/campanhas/${campanhaId}/suspend`, { reason });
  }

  reactivateCampanha(campanhaId: string): Observable<any> {
    return this.httpClient.patch(`${this.URL_API}/admin/campanhas/${campanhaId}/reactivate`, {});
  }

  createSolicitacaoDeposito(campanhaId: string, message?: string): Observable<any> {
    return this.httpClient.post(`${this.URL_API}/${campanhaId}/deposito/request`, {
      request_message: message,
    });
  }

  getSolicitacoesDeposito(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.URL_API}/admin/depositos`);
  }

  updateSolicitacaoDeposito(solicitacaoId: string, status: string, adminMessage?: string): Observable<any> {
    return this.httpClient.patch(`${this.URL_API}/admin/depositos/${solicitacaoId}`, {
      status,
      admin_message: adminMessage,
    });
  }

  getMySolicitacoesDeposito(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.URL_API}/depositos/my-requests`);
  }
}

