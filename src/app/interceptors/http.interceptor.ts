import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoginService } from '../services/login/login.service';
import { catchError, switchMap, tap } from 'rxjs';
import { ApiError } from '../interfaces/apiError';
import { PatientToken } from '../interfaces/patientToken';

const urlLogin = 'login';
const urlRegister = 'register'
const urlExist = 'exist'

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const loginService = inject(LoginService);
  const token = loginService.getToken();
  const url = req.url;

  
  if (!(url.includes(urlLogin)) && !(url.includes(urlRegister)) && !url.includes(urlExist)) {
    const bearerToken = `Bearer ${token}`;
    req = req.clone({
      setHeaders: {
        Authorization: bearerToken,
      },
    });
  }

  return next(req).pipe(
    tap((value) => {
      if (value instanceof HttpResponse) {
        const apiError: ApiError = value.body as ApiError;
        if (apiError.HttpStatus && apiError.HttpStatus !== 200) {
          throw apiError;
        }
      }
    }),
    catchError((error: ApiError) => {
      if (error.HttpStatus === 401) {
        return loginService.refreshToken().pipe(
          switchMap((refreshToken: PatientToken) => {
            const newReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${refreshToken.token}`
              }
            });

            loginService.setToken(refreshToken.token);
            return next(newReq);
          })
        );
      }

      throw error;
    })
  );
};
