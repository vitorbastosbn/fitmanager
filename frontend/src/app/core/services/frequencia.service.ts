import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { CheckInItem, CheckInRequest, CheckInResponse, QrTokenResponse } from '../models/frequencia.models';

@Injectable({
  providedIn: 'root'
})
export class FrequenciaService {
  private http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8080/api/v1/frequencia';

  checkInsHoje = signal<CheckInItem[]>([]);
  loading = signal<boolean>(false);

  gerarTokenQrCode(): Observable<QrTokenResponse> {
    return this.http.get<QrTokenResponse>(`${this.baseUrl}/qrcode-token`);
  }

  registrarCheckIn(request: CheckInRequest): Observable<CheckInResponse> {
    return this.http.post<CheckInResponse>(`${this.baseUrl}/check-in`, request);
  }

  listarCheckInsHoje(): Observable<CheckInItem[]> {
    this.loading.set(true);
    return this.http.get<CheckInItem[]>(`${this.baseUrl}/hoje`).pipe(
      tap({
        next: (items) => {
          this.checkInsHoje.set(items);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      })
    );
  }
}
