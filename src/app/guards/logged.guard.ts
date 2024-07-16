import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../services/login/login.service';

export const loggedGuard: CanActivateFn = (route, state) => {
    const token = inject(LoginService);
    const router = inject(Router);

    if (token.getToken()) {
        router.navigate(['agendamentos']);
        return false;
    }
    return true;
};