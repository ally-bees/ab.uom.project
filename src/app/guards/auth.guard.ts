

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  // Check if user is logged in
  if (!authService.isLoggedIn()) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  // Check role-based access if roles are specified in route data
  if (route.data['roles'] && route.data['roles'].length) {
    const requiredRoles: string[] = route.data['roles'];
    const hasRequiredRole = authService.hasAnyRole(requiredRoles);
    
    if (!hasRequiredRole) {
      // Redirect to appropriate dashboard based on user's role
      const userRole = authService.getCurrentUserRole();
      console.log(`Access denied. User role: ${userRole}, Required roles:`, requiredRoles);
      
      // Redirect to user's appropriate dashboard instead of unauthorized page
      router.navigate([authService.getRedirectUrl()]);
      return false;
    }
  }
  
  return true;
};

// Optional: Create specific role guards for cleaner route configuration
export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }
  
  if (!authService.hasRole('Admin')) {
    router.navigate([authService.getRedirectUrl()]);
    return false;
  }
  
  return true;
};

export const businessOwnerGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }
  
  if (!authService.hasRole('Business Owner')) {
    router.navigate([authService.getRedirectUrl()]);
    return false;
  }
  
  return true;
};

export const salesManagerGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }
  
  if (!authService.hasRole('Sales Manager')) {
    router.navigate([authService.getRedirectUrl()]);
    return false;
  }
  
  return true;
};

export const marketingManagerGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }
  
  if (!authService.hasRole('Marketing Manager')) {
    router.navigate([authService.getRedirectUrl()]);
    return false;
  }
  
  return true;
};

export const inventoryManagerGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }
  
  if (!authService.hasRole('Inventory Manager')) {
    router.navigate([authService.getRedirectUrl()]);
    return false;
  }
  
  return true;
};