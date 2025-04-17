import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isLoggedIn()) {
    // Check if route has data with roles
    if (route.data['roles'] && route.data['roles'].length) {
      const requiredRoles = route.data['roles'];
      const hasRequiredRole = requiredRoles.some((role: string) => authService.hasRole(role));
      
      if (!hasRequiredRole) {
        router.navigate(['/unauthorized']);
        return false;
      }
    }
    
    return true;
  }

  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};