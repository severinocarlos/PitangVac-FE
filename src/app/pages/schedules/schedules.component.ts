import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SchedulesService } from '../../services/schedules/schedules.service';
import { Schedules } from '../../interfaces/schedules';
import { DatePipe } from '@angular/common';
import { take } from 'rxjs';

@Component({
  selector: 'app-schedules',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatTableModule, 
    MatSortModule,
    DatePipe
  ],
  templateUrl: './schedules.component.html',
  styleUrl: './schedules.component.scss'
})
export class SchedulesComponent implements OnInit {
  @ViewChild(MatSort) sort!: MatSort;

  private readonly schedulesService = inject(SchedulesService);
  private schedules: Schedules[] = []

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

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
}
