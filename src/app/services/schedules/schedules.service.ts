import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Schedules } from '../../interfaces/schedules';
import { apiUrl } from '../../../env/api';

@Injectable({
  providedIn: 'root'
})
export class SchedulesService {
  private readonly _http = inject(HttpClient);

  constructor() { }

  getSchedules() {
    return this._http.get<Schedules[]>(apiUrl + 'Scheduling');
  }
}
