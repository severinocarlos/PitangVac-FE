import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { apiUrl } from '../../../env/api';
import { ScheduleRegister } from '../../interfaces/schedule-register';
import { SchedulesPagination } from '../../interfaces/schedules-pagination';
import { BehaviorSubject, tap } from 'rxjs';
import { Schedules } from '../../interfaces/schedules';
import { LoginService } from '../login/login.service';

@Injectable({
  providedIn: 'root'
})
export class SchedulesService {
  private readonly _http = inject(HttpClient);
  private readonly loginService = inject(LoginService);

  private schedulesObservable = new BehaviorSubject<Schedules[]>([]);
  schedules$ = this.schedulesObservable.asObservable();

  private schedulingQuantityObservable = new BehaviorSubject<number>(0);
  schedulingQuantity$ = this.schedulingQuantityObservable.asObservable();


  constructor() { }

  getSchedules(pageIndex: number, pageSize: number) {
    const params = new HttpParams()
      .set('pageNumber', pageIndex)
      .set('pageSize', pageSize);

    const patientId = this.loginService.getPatientId();

    return this._http.get<SchedulesPagination>(apiUrl + `Scheduling/${patientId}`, { params })
                      .pipe(tap(page => {
                        this.schedulesObservable.next(page.schedulings);
                        this.schedulingQuantityObservable.next(page.totalLength);
                      }));
  }

  getHoursAvailable(date: string) {
    return this._http.get<string[]>(apiUrl + `Scheduling/hours-avaliable/${date}`);
  }

  saveScheduling(date: string, time: string) {
    const schedulingBody: ScheduleRegister = {
      schedulingDate: date,
      schedulingTime: time,
      patientId: this.loginService.getPatientId()
    }

    return this._http.post<Schedules>(apiUrl + 'Scheduling', schedulingBody)
      .pipe(tap(scheduling => {
        const oldScheduling = this.schedulesObservable.getValue();
        const newSchedulingList = [...oldScheduling, scheduling];
        this.schedulesObservable.next(newSchedulingList);

        let oldQuantity = this.schedulingQuantityObservable.getValue();
        this.schedulingQuantityObservable.next(oldQuantity + 1);
      }));
  }

  confirmSchedule(scheduleId: number) {
    const patientId = this.loginService.getPatientId();

    return this._http.post<Schedules>(apiUrl + `Scheduling/status/complete`, { scheduleId, patientId })
      .pipe(tap((scheduling: Schedules) => {
        let oldScheduling = this.schedulesObservable.getValue();
        let updateValues = this.getUpdatedSchedulingValues(oldScheduling, scheduling);

        this.schedulesObservable.next([...updateValues]);
      }));;
  }

  cancelSchedule(scheduleId: number) {
    const patientId = this.loginService.getPatientId();

    return this._http.post<Schedules>(apiUrl + `Scheduling/status/cancel`, { scheduleId, patientId })
      .pipe(tap((scheduling: Schedules) => {
        const oldScheduling = this.schedulesObservable.getValue();
        let updateValues = this.getUpdatedSchedulingValues(oldScheduling, scheduling);

        this.schedulesObservable.next([...updateValues]);
      }));;
  }

  private getUpdatedSchedulingValues(oldScheduling: Schedules[], scheduling: Schedules) {
    return oldScheduling.map((schedulingValue) => {
      return schedulingValue.id === scheduling.id ? scheduling : schedulingValue
    });
  }
}
