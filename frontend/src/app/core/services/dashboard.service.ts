import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardAdmin, DashboardRecepcao, DashboardInstrutor, DashboardAluno } from '../models/dashboard.models';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/v1/dashboard';

  getAdminDashboard(): Observable<DashboardAdmin> {
    return this.http.get<DashboardAdmin>(`${this.apiUrl}/admin`);
  }

  getRecepcaoDashboard(): Observable<DashboardRecepcao> {
    return this.http.get<DashboardRecepcao>(`${this.apiUrl}/recepcao`);
  }

  getInstrutorDashboard(): Observable<DashboardInstrutor> {
    return this.http.get<DashboardInstrutor>(`${this.apiUrl}/instrutor`);
  }

  getAlunoDashboard(): Observable<DashboardAluno> {
    return this.http.get<DashboardAluno>(`${this.apiUrl}/aluno`);
  }
}
