import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { of, throwError } from 'rxjs';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'member';
  };
}


@Injectable({
  providedIn: 'root',
})
export class Auth {
  private http = inject(HttpClient);
  private router = inject(Router);

  private _token = signal<string | null>(localStorage.getItem('auth_token'));
  private _user = signal<AuthResponse['user'] | null>(
    JSON.parse(localStorage.getItem('auth_user') ?? 'null')
  );

  readonly token = this._token.asReadonly();
  readonly user = this._user.asReadonly();
  readonly isLoggedIn = computed(() => !!this._token());
  readonly isAdmin = computed(() => this._user()?.role === 'admin');

  login(credentials: LoginCredentials) {
  const mockUsers = [
    { email: 'admin@todo.pl', password: 'admin123', name: 'Admin', role: 'admin' as const, id: '1'},
    { email: 'anna@todo.pl', password: 'anna123', name: 'Anna Kowalska', role: 'member' as const, id: '2'},
];

  const user = mockUsers.find(
    u => u.email === credentials.email && u.password === credentials.password
  );

  if (user) {
    const mockToken = btoa(JSON.stringify({ id: user.id, email: user.email}));
    localStorage.setItem('auth_token', mockToken);
    localStorage.setItem('auth_user', JSON.stringify(user));
    this._token.set(mockToken);
    this._user.set(user);
    this.router.navigate(['/dahsboard']);
    return of({ token: mockToken, user});
  }

  return throwError (() => new Error('Nieprawidłowe dane logowania'))


    //Real API for backend when ready - for now using mock above just for tests of login
    // return this.http.post<AuthResponse>(
    //   `${environment.apiUrl}/auth/login`,
    //   credentials
    // ).pipe(
    //   tap(response => {
    //     localStorage.setItem('auth_token', response.token);
    //     localStorage.setItem('auth_user', JSON.stringify(response.user));
    //     this._token.set(response.token);
    //     this._user.set(response.user);

    //     this.router.navigate(['/dahsboard']);
    //   })
    // )
  }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    this._token.set(null);
    this._user.set(null);
    this.router.navigate(['/login']);
  }
}
