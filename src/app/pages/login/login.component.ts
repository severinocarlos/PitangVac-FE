import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LoginService } from '../../services/login/login.service';
import { Login } from '../../interfaces/login';
import { ApiError } from '../../interfaces/apiError';
import { Router, RouterLink } from '@angular/router';
import { BaseBackgroundComponent } from '../../components/base-background/base-background.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { LoadingService } from '../../services/loading/loading.service';
import { finalize } from 'rxjs';
import { TimeInterval } from 'rxjs/internal/operators/timeInterval';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
    RouterLink,
    BaseBackgroundComponent,
    FooterComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly loginService = inject(LoginService);
  private readonly router = inject(Router);
  private readonly loadingService = inject(LoadingService);
  
  loginForm = this.formBuilder.group({
    login: ['', [Validators.required, Validators.maxLength(50)]],
    password: ['', Validators.required]
  });

  invalidLoginMessage = '';
 
  handleLogin() {
    if (!this.loginForm.valid) {
      return;
    }

    this.loadingService.show();
    this.loginService.login(<Login>this.loginForm.value).pipe(
      finalize(() => {
        this.loadingService.hide();
      })
    ).subscribe({
      next: (_) => {
        this.invalidLoginMessage = '';
        this.router.navigate(['agendamentos']);
      }, error: (error: ApiError) => {
        this.invalidLoginMessage = error.Messages[0];
      }
    });
  }
}
