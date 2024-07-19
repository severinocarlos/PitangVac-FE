import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { apiUrl } from '../../../env/api';
import { ScheduleRegister } from '../../interfaces/schedule-register';
import { SchedulesPagination } from '../../interfaces/schedules-pagination';

@Injectable({
  providedIn: 'root'
})
export class SchedulesService {
  private readonly _http = inject(HttpClient);

  constructor() { }

  getSchedules(pageNumber: number, pageSize: number) {
    const params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);

    return this._http.get<SchedulesPagination>(apiUrl + 'Scheduling', { params });
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
