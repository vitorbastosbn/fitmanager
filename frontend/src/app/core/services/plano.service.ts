import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Plano } from '../models/plano.models';

@Injectable({
  providedIn: 'root'
})
export class PlanoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/v1/planos';

  listar(apenasAtivos = true): Observable<Plano[]> {
    return this.http.get<Plano[]>(`${this.apiUrl}?apenasAtivos=${apenasAtivos}`);
  }

  criar(plano: Partial<Plano>): Observable<Plano> {
    return this.http.post<Plano>(this.apiUrl, plano);
  }

  atualizar(id: number, plano: Partial<Plano>): Observable<Plano> {
    return this.http.put<Plano>(`${this.apiUrl}/${id}`, plano);
  }
}
