import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { SchedulesService } from '../../services/schedules/schedules.service';
import { Schedules } from '../../interfaces/schedules';
import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { merge, startWith, switchMap, take, map, Observable } from 'rxjs';
import { ModalService } from '../../services/modal/modal.service';
import { StatusCardComponent } from '../../components/status-card/status-card.component';
import { ScheduleStatus } from '../../enums/statusEnum';
import { SnackbarService } from '../../services/snackbar/snackbar.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { SchedulesPagination } from '../../interfaces/schedules-pagination';
import { FooterComponent } from '../../components/footer/footer.component';
import { BadgeButtonComponent } from '../../components/badge-button/badge-button.component';

@Component({
  selector: 'app-schedules',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatTableModule, 
    DatePipe,
    StatusCardComponent,
    MatPaginatorModule,
    AsyncPipe,
    FooterComponent,
    BadgeButtonComponent,
    CommonModule
  ],
  templateUrl: './schedules.component.html',
  styleUrl: './schedules.component.scss'
})
export class SchedulesComponent implements OnInit, AfterViewInit {
  private readonly schedulesService = inject(SchedulesService);
  private readonly modalService = inject(ModalService);
  private readonly snackBarService = inject(SnackbarService);
  schedules$: Observable<Schedules[]> = this.schedulesService.schedules$;
  schedlingQuantity$: Observable<number> = this.schedulesService.schedulingQuantity$;

  schedules: Schedules[] = [];
  ScheduleStatus = ScheduleStatus;

  displayedColumns: string[] = ['name', 'status', 'date', 'time', 'scheduleIn', 'actions'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  totalLength = 0;
  pageSizeOptions = [5, 10];

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    merge(this.paginator.page).pipe(
      startWith({}),
      switchMap(() => {
        return this.schedulesService.getSchedules(this.paginator.pageIndex, this.paginator.pageSize);
      }),
      map((pagination: SchedulesPagination) => {
        this.totalLength = pagination.totalLength;

        return pagination.schedulings;
      }),
    ).subscribe((data) => this.schedules = data )
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
              // TODO: Rever forma de passar os parâmetros para a função
              this.snackBarService.openSnackBar('Agendamento concluído!', '' ,'snackbar-success');

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
              // TODO: Rever forma de passar os parâmetros para a função
              this.snackBarService.openSnackBar('Agendamento cancelado!', '', 'snackbar-fail');

              // TODO: Salvar o return no behavior subject
            }
          )
        }
      }
    )
  }
}
