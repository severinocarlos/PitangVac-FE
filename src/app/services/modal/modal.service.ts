import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ScheduleRegisterModalComponent } from '../../components/schedule-register-modal/schedule-register-modal.component';
import { ActionModalComponent } from '../../components/action-modal/action-modal.component';
import { InfoModalComponent } from '../../components/info-modal/info-modal.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private sizeModal = {
    minWidth: '300px',
    width: '600px',
  }
  private dialog = inject(MatDialog);

  constructor() { }

  openScheduleRegisterModal() {
    this.dialog.open(ScheduleRegisterModalComponent, {
      minWidth: this.sizeModal.minWidth,
      width: this.sizeModal.width,
      disableClose: true,
    })
  }

  openActionModal(title: string, message: string) {
    let dialogRef = this.dialog.open(ActionModalComponent, {
      minWidth: this.sizeModal.minWidth,
      width: this.sizeModal.width,
      disableClose: true,
      data: {
        title,
        message
      }
    })

    return dialogRef;
  }

  openInfoModal(message: string, nameIcon: string, colorIcon: Colors, title?: string) {
    this.dialog.open(InfoModalComponent, {
      minWidth: this.sizeModal.minWidth,
      width: this.sizeModal.width,
      disableClose: true,
      data: {
        title,
        message,
        icon: {
          name: nameIcon,
          color: colorIcon
        }
      }
    });
  }
}

type Colors =  'green' | 'red' | 'blue' | 'yellow';
