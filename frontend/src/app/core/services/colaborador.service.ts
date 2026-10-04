import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Colaborador, ColaboradorCreate, ColaboradorUpdate } from '../models/colaborador.models';
import { Page } from '../models/aluno.models';

@Injectable({
  providedIn: 'root'
})
export class ColaboradorService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/v1/colaboradores';

  listar(busca?: string, page = 0, size = 10): Observable<Page<Colaborador>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (busca) params = params.set('busca', busca);

    return this.http.get<Page<Colaborador>>(this.apiUrl, { params });
  }

  buscarPorId(id: number): Observable<Colaborador> {
    return this.http.get<Colaborador>(`${this.apiUrl}/${id}`);
  }

  listarInstrutores(): Observable<Colaborador[]> {
    return this.http.get<Colaborador[]>(`${this.apiUrl}/instrutores`);
  }

  cadastrar(colaborador: ColaboradorCreate): Observable<Colaborador> {
    return this.http.post<Colaborador>(this.apiUrl, colaborador);
  }

  atualizar(id: number, colaborador: ColaboradorUpdate): Observable<Colaborador> {
    return this.http.put<Colaborador>(`${this.apiUrl}/${id}`, colaborador);
  }

  alterarStatus(id: number, ativo: boolean): Observable<Colaborador> {
    return this.http.patch<Colaborador>(`${this.apiUrl}/${id}/status`, { ativo });
  }
}
