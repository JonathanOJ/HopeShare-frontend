import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Campanha, DenunciaCampanhaGrouped } from '../models/campanha.model';
import { Comentario } from '../models/comentario.model';
import { Observable } from 'rxjs';
import { CreateSolicitacaoDepositoRequest, SolicitacaoDeposito } from '../models/solicitacao-deposito.model';
import { Denuncia } from '../models/denuncia.model';

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

  findCampanhaByUser(id: string, with_comments: boolean = false): Observable<Campanha[]> {
    const params = {
      with_comments: with_comments ? 'true' : 'false',
    };
    return this.httpClient.get<Campanha[]>(`${this.URL_API}/findAllByUser/${id}`, { params });
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

  reportCampanha(reportData: any): Observable<any> {
    return this.httpClient.post(`${this.URL_API}/report`, reportData);
  }

  addComment(campanha_id: string, commentData: any): Observable<Comentario> {
    return this.httpClient.post<Comentario>(`${this.URL_API}/${campanha_id}/comments`, commentData);
  }

  getComments(campanha_id: string): Observable<Comentario[]> {
    return this.httpClient.get<Comentario[]>(`${this.URL_API}/${campanha_id}/comments`);
  }

  deleteComment(campanha_id: string, commentId: string): Observable<any> {
    return this.httpClient.delete(`${this.URL_API}/${campanha_id}/comments/${commentId}`);
  }

  getDenuncias(user_id: string): Observable<Denuncia[]> {
    return this.httpClient.get<Denuncia[]>(`${this.URL_API}/admin/${user_id}/reports`);
  }

  getDenunciasGrouped(user_id: string): Observable<DenunciaCampanhaGrouped[]> {
    return this.httpClient.get<DenunciaCampanhaGrouped[]>(`${this.URL_API}/admin/${user_id}/reports-grouped`);
  }

  updateDenunciaStatus(denuncia_id: string, status: string, user_id: string) {
    return this.httpClient.patch(`${this.URL_API}/admin/${user_id}/reports/${denuncia_id}/status`, { status });
  }

  suspendCampanha(campanha_id: string, reason: string, user_id: string) {
    return this.httpClient.patch(`${this.URL_API}/admin/${user_id}/campanha/${campanha_id}/suspend`, { reason });
  }

  reactivateCampanha(campanha_id: string, user_id: string) {
    return this.httpClient.patch(`${this.URL_API}/admin/${user_id}/campanha/${campanha_id}/reactivate`, null);
  }

  createSolicitacaoDeposito(payload: CreateSolicitacaoDepositoRequest) {
    return this.httpClient.post(`${this.URL_API}/deposito/request`, payload);
  }

  getSolicitacoesDeposito(user_id: string): Observable<SolicitacaoDeposito[]> {
    return this.httpClient.get<SolicitacaoDeposito[]>(`${this.URL_API}/admin/${user_id}/deposito/pending`);
  }

  getSolicitacoesDepositoByUserId(user_id: string): Observable<SolicitacaoDeposito[]> {
    return this.httpClient.get<SolicitacaoDeposito[]>(`${this.URL_API}/depositos/findByUser/${user_id}`);
  }

  updateSolicitacaoDeposito(payload: any): Observable<any> {
    return this.httpClient.patch(`${this.URL_API}/admin/depositos/status`, payload);
  }

  getMySolicitacoesDeposito(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.URL_API}/depositos/my-requests`);
  }
}

