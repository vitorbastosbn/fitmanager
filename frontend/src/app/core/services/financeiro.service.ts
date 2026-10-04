import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Cobranca, PagarCobrancaRequest, PagamentoResponse } from '../models/financeiro.models';

@Injectable({
  providedIn: 'root'
})
export class FinanceiroService {
  private http = inject(HttpClient);
  private baseUrl = '/api/v1';

  cobrancas = signal<Cobranca[]>([]);
  loading = signal<boolean>(false);

  listarCobrancas(params?: { matriculaId?: number; alunoId?: number }): Observable<Cobranca[]> {
    this.loading.set(true);
    let httpParams = new HttpParams();
    if (params?.matriculaId) {
      httpParams = httpParams.set('matriculaId', params.matriculaId.toString());
    }
    if (params?.alunoId) {
      httpParams = httpParams.set('alunoId', params.alunoId.toString());
    }

    return this.http.get<Cobranca[]>(`${this.baseUrl}/cobrancas`, { params: httpParams }).pipe(
      tap({
        next: (res) => {
          this.cobrancas.set(res);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      })
    );
  }

  quitarCobranca(id: number, request: PagarCobrancaRequest): Observable<PagamentoResponse> {
    return this.http.post<PagamentoResponse>(`${this.baseUrl}/cobrancas/${id}/pagar`, request);
  }

  extratoAluno(): Observable<Cobranca[]> {
    this.loading.set(true);
    return this.http.get<Cobranca[]>(`${this.baseUrl}/alunos/me/cobrancas`).pipe(
      tap({
        next: (res) => {
          this.cobrancas.set(res);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      })
    );
  }
}
