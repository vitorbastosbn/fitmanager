import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { AuthService } from './core/services/auth.service';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideHttpClient(), provideRouter([])]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title when authenticated', async () => {
    const fixture = TestBed.createComponent(App);
    const authService = TestBed.inject(AuthService);
    authService.currentUser.set({
      id: 1,
      nome: 'Administrador do Sistema',
      email: 'admin@fitmanager.com',
      perfil: 'ROLE_ADMIN',
      ativo: true,
      primeiroAcesso: false
    });
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('FITMANAGER');
  });
});
