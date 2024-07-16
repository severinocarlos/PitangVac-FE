import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { apiUrl } from '../../../env/api';
import { Login } from '../../interfaces/login';
import { PatientToken } from '../../interfaces/patientToken';
import { BehaviorSubject, tap } from 'rxjs';
import { ApiError } from '../../interfaces/apiError';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private readonly _http = inject(HttpClient);
  private readonly router = inject(Router);

  private isAuthenticated = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticated.asObservable();

  constructor() {
    this.checkAuthentication();  
  }

  login(formLogin: Login) {
    return this._http.post<PatientToken>(apiUrl + 'Authentication/login', formLogin).pipe(
      tap((response: PatientToken | ApiError) => {
        if ('Messages' in response) {
          var apiError = response as ApiError;
          if (apiError.HttpStatus !== 200) {
            throw apiError;
          }
        } else {
          localStorage.setItem('token', response.token);
          this.isAuthenticated.next(true);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.isAuthenticated.next(false);
    this.router.navigate(['login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  checkAuthentication() {
    const token = this.getToken();

    if (token) {
      this.isAuthenticated.next(true);
    }
  }
}
