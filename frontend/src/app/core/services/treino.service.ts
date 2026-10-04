import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import {
  CriarFichaTreinoRequest,
  Exercicio,
  FichaTreino,
  GrupoMuscular,
  RegistrarExecucaoRequest,
  RegistroExecucaoResponse
} from '../models/treino.models';

@Injectable({
  providedIn: 'root'
})
export class TreinoService {
  private http = inject(HttpClient);
  private baseUrl = '/api/v1';

  exercicios = signal<Exercicio[]>([]);
  fichaAtiva = signal<FichaTreino | null>(null);
  loading = signal<boolean>(false);

  listarExercicios(grupoMuscular?: GrupoMuscular): Observable<Exercicio[]> {
    this.loading.set(true);
    let params = new HttpParams();
    if (grupoMuscular) {
      params = params.set('grupoMuscular', grupoMuscular);
    }

    return this.http.get<Exercicio[]>(`${this.baseUrl}/exercicios`, { params }).pipe(
      tap({
        next: (items) => {
          this.exercicios.set(items);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      })
    );
  }

  prescreverFicha(request: CriarFichaTreinoRequest): Observable<FichaTreino> {
    return this.http.post<FichaTreino>(`${this.baseUrl}/fichas-treino`, request);
  }

  buscarFichaAtiva(alunoId: number): Observable<FichaTreino> {
    this.loading.set(true);
    return this.http.get<FichaTreino>(`${this.baseUrl}/alunos/${alunoId}/ficha-ativa`).pipe(
      tap({
        next: (ficha) => {
          this.fichaAtiva.set(ficha);
          this.loading.set(false);
        },
        error: () => {
          this.fichaAtiva.set(null);
          this.loading.set(false);
        }
      })
    );
  }

  buscarMinhaFichaAtiva(): Observable<FichaTreino> {
    this.loading.set(true);
    return this.http.get<FichaTreino>(`${this.baseUrl}/alunos/me/ficha-ativa`).pipe(
      tap({
        next: (ficha) => {
          this.fichaAtiva.set(ficha);
          this.loading.set(false);
        },
        error: () => {
          this.fichaAtiva.set(null);
          this.loading.set(false);
        }
      })
    );
  }

  registrarExecucao(request: RegistrarExecucaoRequest): Observable<RegistroExecucaoResponse> {
    return this.http.post<RegistroExecucaoResponse>(`${this.baseUrl}/treinos/execucoes`, request);
  }
}
