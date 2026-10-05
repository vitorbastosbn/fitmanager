import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LogAuditoriaLgpd, TermoVigente } from '../models/lgpd.models';
import { Page } from '../models/aluno.models';

@Injectable({
  providedIn: 'root'
})
export class LgpdService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/v1/lgpd';

  obterTermoVigente(): Observable<TermoVigente> {
    return this.http.get<TermoVigente>(`${this.apiUrl}/termos/vigente`);
  }

  registrarAceite(termoId: number): Observable<{ mensagem: string }> {
    return this.http.post<{ mensagem: string }>(`${this.apiUrl}/termos/${termoId}/aceite`, {});
  }

  exportarMeusDados(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/meus-dados/exportar`, {
      responseType: 'blob'
    });
  }

  anonimizarMeusDados(): Observable<{ mensagem: string }> {
    return this.http.post<{ mensagem: string }>(`${this.apiUrl}/meus-dados/anonimizar`, {});
  }

  listarAuditoria(page = 0, size = 15): Observable<Page<LogAuditoriaLgpd>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<Page<LogAuditoriaLgpd>>(`${this.apiUrl}/auditoria`, { params });
  }
}
