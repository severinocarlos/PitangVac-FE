import { Component, Input } from '@angular/core';
import { Status } from '../../interfaces/schedules';
import { CommonModule } from '@angular/common';
import { ScheduleStatus } from '../../enums/statusEnum';

@Component({
  selector: 'app-status-card',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './status-card.component.html',
  styleUrl: './status-card.component.scss'
})
export class StatusCardComponent {
  @Input() type!: Status;
  ScheduleStatus = ScheduleStatus;
}
