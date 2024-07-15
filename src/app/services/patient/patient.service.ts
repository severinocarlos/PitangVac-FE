import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { apiUrl } from '../../../env/api';
import { delay } from 'rxjs';
import { PatientRegister } from '../../interfaces/patient-register';
import { Patient } from '../../interfaces/patient';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  _http = inject(HttpClient);

  constructor() { }

  checkPatientExistByLogin(login: string) {
    return this._http.get<boolean>(apiUrl + `Patient/exist/login/${login}`).pipe(delay(1000));
  }

  checkPatientExistByEmail(email: string) {
    return this._http.get<boolean>(apiUrl + `Patient/exist/email/${email}`).pipe(delay(1000));
  }

  register(patient: PatientRegister) {
    return this._http.post<Patient>(apiUrl + "Patient/register", patient);
  }
}
