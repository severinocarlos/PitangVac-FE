import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginService } from './services/login/login.service';
import { HeaderComponent } from './components/header/header.component';
import { AsyncPipe } from '@angular/common';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    HeaderComponent, 
    AsyncPipe,
    FooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private readonly loginService = inject(LoginService);
  readonly isAuthenticated = this.loginService.isAuthenticated$;
}
