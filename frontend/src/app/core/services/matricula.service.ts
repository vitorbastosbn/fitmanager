import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Matricula, MatriculaCreate } from '../models/plano.models';

@Injectable({
  providedIn: 'root'
})
export class MatriculaService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/v1/matriculas';

  matricular(dados: MatriculaCreate): Observable<Matricula> {
    return this.http.post<Matricula>(this.apiUrl, dados);
  }

  listarPorAluno(alunoId: number): Observable<Matricula[]> {
    return this.http.get<Matricula[]>(`${this.apiUrl}/aluno/${alunoId}`);
  }

  cancelar(id: number, motivo: string): Observable<Matricula> {
    return this.http.post<Matricula>(`${this.apiUrl}/${id}/cancelar`, { motivo });
  }
}
