import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { SchedulesComponent } from './pages/schedules/schedules.component';
import { loggedGuard } from './guards/logged.guard';
import { authenticateGuard } from './guards/authenticate.guard';

export const routes: Routes = [
    {
        path: "",
        redirectTo: "login",
        pathMatch: 'full',
    },
    {
        path: "login",
        component: LoginComponent,
        pathMatch: 'full',
        canActivate: [loggedGuard]
    },
    {
        path: "cadastrar",
        component: RegisterComponent,
        pathMatch: 'full',
        canActivate: [loggedGuard]
    },
    {
        path: "agendamentos",
        component: SchedulesComponent,
        pathMatch: 'full',
        canActivate: [authenticateGuard]
    }
];
