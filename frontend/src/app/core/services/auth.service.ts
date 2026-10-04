import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AlterarSenhaRequest, LoginRequest, TokenResponse, Usuario } from '../models/auth.models';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly apiUrl = 'http://localhost:8080/api/v1/auth';
  private readonly TOKEN_KEY = 'fitmanager_token';
  private readonly USER_KEY = 'fitmanager_user';

  readonly currentUser = signal<Usuario | null>(this.getStoredUser());
  readonly isAuthenticated = computed(() => !!this.currentUser());
  readonly needsPasswordChange = computed(() => this.currentUser()?.primeiroAcesso ?? false);

  login(credentials: LoginRequest): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem(this.TOKEN_KEY, response.accessToken);
        localStorage.setItem(this.USER_KEY, JSON.stringify(response.usuario));
        this.currentUser.set(response.usuario);
      })
    );
  }

  alterarSenhaPrimeiroAcesso(request: AlterarSenhaRequest): Observable<{ mensagem: string }> {
    return this.http.post<{ mensagem: string }>(`${this.apiUrl}/alterar-senha-primeiro-acesso`, request).pipe(
      tap(() => {
        const user = this.currentUser();
        if (user) {
          const updated = { ...user, primeiroAcesso: false };
          localStorage.setItem(this.USER_KEY, JSON.stringify(updated));
          this.currentUser.set(updated);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  hasRole(role: string): boolean {
    return this.currentUser()?.perfil === role;
  }

  private getStoredUser(): Usuario | null {
    const raw = localStorage.getItem(this.USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
}
