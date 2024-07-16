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
  formBuilder = inject(FormBuilder);
  loginService = inject(LoginService);
  router = inject(Router);
  
  loginForm = this.formBuilder.group({
    login: ['', [Validators.required, Validators.maxLength(50)]],
    password: ['', Validators.required]
  });

  invalidLoginMessage = '';
 
  handleLogin() {
    if (!this.loginForm.valid) {
      return;
    }

    this.loginService.login(<Login>this.loginForm.value).subscribe({
      next: (_) => {
        this.invalidLoginMessage = '';
        this.router.navigate(['agendamentos']);
      }, error: (error: ApiError) => {
        this.invalidLoginMessage = error.Messages[0];
      }
    });
  }
}
