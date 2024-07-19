import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingObservable = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingObservable.asObservable();

  private request = false;

  constructor() { }

  show() {
    this.request = true;
    if (this.request) {
      this.loadingObservable.next(true);
    }
  }

  hide() {
    this.request = false;
    this.loadingObservable.next(false);
  }
}
