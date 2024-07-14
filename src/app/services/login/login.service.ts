import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { apiUrl } from '../../../env/api';
import { Login } from '../../interfaces/login';
import { PatientToken } from '../../interfaces/patientToken';
import { tap } from 'rxjs';
import { ApiError } from '../../interfaces/apiError';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private _http = inject(HttpClient);

  login(formLogin: Login) {
    return this._http.post<PatientToken>(apiUrl + 'Authentication/login', formLogin).pipe(
      tap((response: PatientToken | ApiError) => {
        if ('Messages' in response) {
          var apiError = response as ApiError;
          if (apiError.HttpStatus !== 200) {
            throw apiError;
          }
        } else {
          localStorage.setItem('token', response.token)
        }
      })
    );
  }
}
