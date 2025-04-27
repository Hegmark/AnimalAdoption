import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { filter, map, take } from 'rxjs';

export const AdminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
    const router = inject(Router);

    return authService.userRole$.pipe(
      filter(role => role !== null), 
      take(1),
      map(role => {
        console.log('Guard finally checked role:', role);
        if (role === 'admin') {
          return true;
        } else {
          router.navigate(['/']);
          return false;
        }
      })
    );
};
