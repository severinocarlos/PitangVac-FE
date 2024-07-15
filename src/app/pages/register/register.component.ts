import { Component, inject, OnInit, signal } from '@angular/core';
import { BaseBackgroundComponent } from '../../components/base-background/base-background.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { PatientRegisterValidator } from '../../validators/PatientRegisterValidations';
import { PatientService } from '../../services/patient/patient.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ApiError } from '../../interfaces/apiError';
import { PatientRegister } from '../../interfaces/patient-register';
import { Router } from '@angular/router';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-register',
  standalone: true,
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    provideNativeDateAdapter()
  ],
  imports: [
    BaseBackgroundComponent,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CommonModule,
    MatIconModule,
    FooterComponent
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  hide = signal(true);
  formBuilder = inject(FormBuilder);
  patientService = inject(PatientService);
  router = inject(Router);

  registerForm = this.formBuilder.group({
    name: ['', Validators.required],
    login: ['', [Validators.required, Validators.maxLength(50)], [PatientRegisterValidator.checkLogin(this.patientService)]],
    email: ['', [Validators.required, Validators.email], [PatientRegisterValidator.checkEmail(this.patientService)]],
    password: ['', Validators.required],
    birthDate: ['', Validators.required]
  });

  ngOnInit(): void {
    this.formatISODate();
  }

  handleRegister() {
    if (!this.registerForm.valid) {
      return;
    }
    
    this.patientService.register(<PatientRegister>this.registerForm.value).subscribe({
      next: (res) => {
        this.router.navigate(['login']);
      }, error: (_: ApiError) => {

      }
    })
  }

  formatISODate() {
    this.registerForm.get('birthDate')?.valueChanges.subscribe(value => {
      if (value) {
        const isoString = new Date(value).toISOString();
        this.registerForm.get('birthDate')?.setValue(isoString, { emitEvent: false });
      }
    });
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
}
