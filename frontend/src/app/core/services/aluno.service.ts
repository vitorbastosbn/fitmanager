import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Aluno, AlunoCreate, AlunoUpdate, Page } from '../models/aluno.models';

@Injectable({
  providedIn: 'root'
})
export class AlunoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/v1/alunos';

  listar(nome?: string, status?: string, cpf?: string, page = 0, size = 10): Observable<Page<Aluno>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (nome) params = params.set('nome', nome);
    if (status) params = params.set('status', status);
    if (cpf) params = params.set('cpf', cpf);

    return this.http.get<Page<Aluno>>(this.apiUrl, { params });
  }

  buscarPorId(id: number): Observable<Aluno> {
    return this.http.get<Aluno>(`${this.apiUrl}/${id}`);
  }

  cadastrar(aluno: AlunoCreate): Observable<Aluno> {
    return this.http.post<Aluno>(this.apiUrl, aluno);
  }

  atualizar(id: number, aluno: AlunoUpdate): Observable<Aluno> {
    return this.http.put<Aluno>(`${this.apiUrl}/${id}`, aluno);
  }

  inativar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
