import { CommonModule } from '@angular/common';
import { Component, Inject, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MAT_DATE_LOCALE, MatOptionModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogModule, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SchedulesService } from '../../services/schedules/schedules.service';
import { take } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { ScheduleRegister } from '../../interfaces/schedule-register';
import { ApiError } from '../../interfaces/apiError';
import { Schedules } from '../../interfaces/schedules';
import { ModalService } from '../../services/modal/modal.service';

@Component({
  selector: 'app-schedule-register-modal',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButton,
    MatInputModule,
    MatDatepickerModule,
    CommonModule,
    MatSelectModule,
    MatOptionModule,
    MatIconModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    provideNativeDateAdapter()
  ],
  templateUrl: './schedule-register-modal.component.html',
  styleUrl: './schedule-register-modal.component.scss'
})
export class ScheduleRegisterModalComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<ScheduleRegisterModalComponent>);
  private readonly formBuilder = inject(FormBuilder);
  private readonly scheduleService = inject(SchedulesService);
  private readonly modalService = inject(ModalService);

  hoursAvailable: string[] = []

  scheduleRegisterForm = this.formBuilder.group({
    schedulingDate: ['', Validators.required],
    schedulingTime: ['', Validators.required]
  });

  errorMessage = '';

  constructor() { }

  ngOnInit(): void {
    this.formatISODate();
  }

  handleSchedulingRegister() {
    this.errorMessage = '';

    if (!this.scheduleRegisterForm.valid) {
      return;
    }

    this.scheduleService.saveScheduling(<ScheduleRegister>this.scheduleRegisterForm.value)
                        .pipe(take(1))
                        .subscribe({
                          next: (_) => {
                            this.dialogRef.close();
                            this.modalService.openInfoModal(
                              'Parabéns por realizar o agendamento da vacina, ela salva vidas.',
                              'task_alt',
                              'green',
                              'Agendamento realizado com sucesso!',
                            );
                          }, error: (error: ApiError) => {
                            this.errorMessage = error.Messages[0];
                          }
                        });
  }

  getHoursAvailable() {
    this.scheduleService.getHoursAvailable(this.schedulingDate).pipe(take(1)).subscribe(
      res => {
        this.hoursAvailable = res;
      }
    )
  }

  formatISODate() {
    this.scheduleRegisterForm.get('schedulingDate')?.valueChanges.subscribe(value => {
      if (value) {
        let isoString = new Date(value).toISOString();
        isoString = isoString.replace('T03', 'T00');
        this.scheduleRegisterForm.get('schedulingDate')?.setValue(isoString, { emitEvent: false });
      }
    });
  }

  get schedulingDate() {
    return <string>this.scheduleRegisterForm.get('schedulingDate')!.value;
  }
}