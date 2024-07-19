import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { apiUrl } from '../../../env/api';
import { ScheduleRegister } from '../../interfaces/schedule-register';
import { SchedulesPagination } from '../../interfaces/schedules-pagination';
import { BehaviorSubject, map, tap } from 'rxjs';
import { Schedules } from '../../interfaces/schedules';

@Injectable({
  providedIn: 'root'
})
export class SchedulesService {
  private readonly _http = inject(HttpClient);
  private schedulesObservable = new BehaviorSubject<Schedules[]>([]);
  schedules$ = this.schedulesObservable.asObservable();

  constructor() { }

  getSchedules(pageIndex: number, pageSize: number) {
    const params = new HttpParams()
      .set('pageNumber', pageIndex)
      .set('pageSize', pageSize);

    return this._http.get<SchedulesPagination>(apiUrl + 'Scheduling', { params })
                      .pipe(tap(page => {
                        this.schedulesObservable.next(page.schedulings);
                      }));
  }

  getHoursAvailable(date: string) {
    return this._http.get<string[]>(apiUrl + `Scheduling/hours-avaliable/${date}`);
  }

  saveScheduling(scheduling: ScheduleRegister) {
    return this._http.post<Schedules>(apiUrl + 'Scheduling', scheduling)
      .pipe(tap(scheduling => {
        const oldScheduling = this.schedulesObservable.getValue();
        this.schedulesObservable.next([...oldScheduling, scheduling]);
      }));
  }

  confirmSchedule(scheduleId: number) {
    return this._http.post<Schedules>(apiUrl + `Scheduling/status/complete`, { scheduleId })
      .pipe(tap(scheduling => {
        let oldScheduling = this.schedulesObservable.getValue();

        let updateValues = oldScheduling.map((schedulingValue) => {
          return schedulingValue.id === scheduling.id ? scheduling  : schedulingValue
        });

        this.schedulesObservable.next([...updateValues]);
      }));;
  }

  cancelSchedule(scheduleId: number) {
    return this._http.post<Schedules>(apiUrl + `Scheduling/status/cancel`, { scheduleId })
      .pipe(tap(scheduling => {
        const oldScheduling = this.schedulesObservable.getValue();
        let updateValues = oldScheduling.map((schedulingValue) => {
          return schedulingValue.id === scheduling.id ? scheduling : schedulingValue
        });

        this.schedulesObservable.next([...updateValues]);
      }));;
  }
}
