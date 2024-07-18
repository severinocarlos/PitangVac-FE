import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ScheduleRegisterModalComponent } from '../../components/schedule-register-modal/schedule-register-modal.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private dialog = inject(MatDialog);

  constructor() { }

  openScheduleRegisterModal() {
    this.dialog.open(ScheduleRegisterModalComponent, {
      minWidth: '300px',
      width: '600px',
      disableClose: true,
    })
  }

}
