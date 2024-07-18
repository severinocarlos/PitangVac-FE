import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SchedulesService } from '../../services/schedules/schedules.service';
import { Schedules } from '../../interfaces/schedules';
import { DatePipe } from '@angular/common';
import { take } from 'rxjs';
import { ModalService } from '../../services/modal/modal.service';
import { StatusCardComponent } from '../../components/status-card/status-card.component';
import { ScheduleStatus } from '../../enums/statusEnum';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-schedules',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatTableModule, 
    DatePipe,
    StatusCardComponent
  ],
  templateUrl: './schedules.component.html',
  styleUrl: './schedules.component.scss'
})
export class SchedulesComponent implements OnInit {
  private readonly schedulesService = inject(SchedulesService);
  private readonly modalService = inject(ModalService);
  private readonly _snackBar = inject(MatSnackBar);

  private schedules: Schedules[] = [];
  ScheduleStatus = ScheduleStatus;

  displayedColumns: string[] = ['name', 'status', 'date', 'time', 'scheduleIn', 'actions'];
  dataSource = new MatTableDataSource(this.schedules);

  ngOnInit(): void {
    this.getSchedules();
  }

  getSchedules() {
    this.schedules = [];

    this.schedulesService.getSchedules().pipe(take(1)).subscribe(
      schedules => {
        this.schedules = schedules;
        this.dataSource.data = this.schedules;
      }
    )
  }

  registerSchedule() {
    this.modalService.openScheduleRegisterModal();
  }

  confirmSchedule(id: number) {
    const title = 'Concluir agendamento'
    const message = 'Você tem certeza que deseja confirmar que foi atendido(a)?'

    const dialogRef = this.modalService.openActionModal(title, message);

    dialogRef.afterClosed().subscribe(
      confirmAction => {
        if (confirmAction) {
          this.schedulesService.confirmSchedule(id).pipe(take(1)).subscribe(
            res => {
              // TODO: Salvar o return no behavior subject
            }
          )
        }
      }
    )
  }

  cancelSchedule(id: number) {
    const title = 'Cancelar agendamento'
    const message = 'Você tem certeza que deseja cancelar seu atendimento?'

    const dialogRef = this.modalService.openActionModal(title, message);
    dialogRef.afterClosed().subscribe(
      confirmAction => {
        if (confirmAction) {
          this.schedulesService.cancelSchedule(id).pipe(take(1)).subscribe(
            res => {
              // TODO: Salvar o return no behavior subject
            }
          )
        }
      }
    )
  }
}
