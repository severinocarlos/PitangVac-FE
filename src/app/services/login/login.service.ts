import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { apiUrl } from '../../../env/api';
import { Login } from '../../interfaces/login';
import { PatientToken } from '../../interfaces/patientToken';
import { BehaviorSubject, tap } from 'rxjs';
import { ApiError } from '../../interfaces/apiError';
import { Router } from '@angular/router';
import { jwtDecode, JwtPayload } from "jwt-decode";


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
          this.setToken(response.token)
          this.isAuthenticated.next(true);
        }
      })
    );
  }

  refreshToken() {
    return this._http.get<PatientToken>(apiUrl + `Authentication/refresh-token`);
  }

  logout() {
    localStorage.removeItem('token');
    this.isAuthenticated.next(false);
    this.router.navigate(['login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getTokenDecoded() {
    const token = this.getToken();
    return jwtDecode(token!) as JwtInfo;
  }

  getPatientId() {
    const tokenDecoded = this.getTokenDecoded();

    return parseInt(tokenDecoded.id);
  }

  getPatientName() {
    const tokenDecoded = this.getTokenDecoded();

    return tokenDecoded.name;
  }

  checkAuthentication() {
    const token = this.getToken();

    if (token) {
      this.isAuthenticated.next(true);
    }
  }
}

interface JwtInfo {
  id: string,
  login: string,
  name: string
}
