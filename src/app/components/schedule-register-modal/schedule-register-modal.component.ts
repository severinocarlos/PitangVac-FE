import { CommonModule } from '@angular/common';
import { Component, Inject, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MAT_DATE_LOCALE, MatOptionModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogContent, MatDialogModule, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SchedulesService } from '../../services/schedules/schedules.service';
import { take } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { ApiError } from '../../interfaces/apiError';
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
    schedulingDate: [new Date(), [Validators.required, this.isDatePast]],
    schedulingTime: ['', Validators.required]
  });
  errorMessage = '';

  constructor() { }


  ngOnInit(): void {
    this.getHoursAvailable();
  }

  handleSchedulingRegister() {
    this.errorMessage = '';
    if (!this.scheduleRegisterForm.valid) {
      return;
    }

    const ISODate = this.formatISODate(this.schedulingDate);
    this.scheduleService.saveScheduling(ISODate, this.schedulingTime)
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
    const ISODate = this.formatISODate(this.schedulingDate);

    this.scheduleService.getHoursAvailable(ISODate).pipe(take(1)).subscribe(
      res => {
        this.hoursAvailable = res;
      }
    )
  }

  myFilter(d: Date | null): boolean {
    const dateChosen = (d || new Date());
    const today = new Date();

    dateChosen.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return dateChosen >= today;
  };

  isDatePast(control: AbstractControl): ValidationErrors | null {
  const date = control.value;

    return date.getDate() < new Date().getDate() ? { past: true } : null; 
  }

  formatISODate(date: Date) {
    let isoString = new Date(date).toISOString();
    return isoString.replace('T03', 'T00');
  }

  get schedulingDate() {
    return <Date>this.scheduleRegisterForm.get('schedulingDate')!.value;
  }

  get schedulingTime() {
    return <string>this.scheduleRegisterForm.get('schedulingTime')!.value;
  }
}