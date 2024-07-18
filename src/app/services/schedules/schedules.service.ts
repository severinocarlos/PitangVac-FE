import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Schedules } from '../../interfaces/schedules';
import { apiUrl } from '../../../env/api';
import { ScheduleRegister } from '../../interfaces/schedule-register';

@Injectable({
  providedIn: 'root'
})
export class SchedulesService {
  private readonly _http = inject(HttpClient);

  constructor() { }

  getSchedules() {
    return this._http.get<Schedules[]>(apiUrl + 'Scheduling');
  }

  getHoursAvailable(date: string) {
    return this._http.get<string[]>(apiUrl + `Scheduling/hours-avaliable/${date}`);
  }

  saveScheduling(scheduling: ScheduleRegister) {
    return this._http.post(apiUrl + 'Scheduling', scheduling);
  }

  confirmSchedule(scheduleId: number) {
    return this._http.post(apiUrl + `Scheduling/status/complete`, { scheduleId });
  }

  cancelSchedule(scheduleId: number) {
    return this._http.post(apiUrl + `Scheduling/status/cancel`, { scheduleId });
  }
}
