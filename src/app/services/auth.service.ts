
// import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { BehaviorSubject, Observable, tap } from 'rxjs';
// import { User, RegisterRequest, LoginRequest, AuthResponse } from '../models/user.model';
// import { JwtHelperService } from '@auth0/angular-jwt';
// import { isPlatformBrowser } from '@angular/common';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   private apiUrl = 'http://localhost:5241/api';  // Base API URL without /auth
//   private authUrl = 'http://localhost:5241/api/auth'; // Auth specific URL
//   private currentUserSubject = new BehaviorSubject<User | null>(null);
//   public currentUser$ = this.currentUserSubject.asObservable();
//   private jwtHelper = new JwtHelperService();
//   private isBrowser: boolean;

//   constructor(
//     private http: HttpClient,
//     @Inject(PLATFORM_ID) private platformId: Object
//   ) {
//     this.isBrowser = isPlatformBrowser(platformId);
//     if (this.isBrowser) {
//       this.loadStoredUser();
//     }
//   }

//   private loadStoredUser(): void {
//     if (!this.isBrowser) return;
    
//     const token = localStorage.getItem('token');
//     if (token && !this.jwtHelper.isTokenExpired(token)) {
//       const decodedToken = this.jwtHelper.decodeToken(token);
//       console.log('Decoded token:', decodedToken); // Add this for debugging
      
//       const user: User = {
//         id: decodedToken.sub,
//         username: decodedToken.username,
//         email: decodedToken.email,
//         honeycombId: decodedToken.honeycombId,
//         roles: decodedToken.role || decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] // Try both formats
//       };
//       this.currentUserSubject.next(user);
//     }
//   }

//   register(registerData: RegisterRequest): Observable<AuthResponse> {
//     return this.http.post<AuthResponse>(`${this.authUrl}/register`, registerData)
//       .pipe(
//         tap(response => {
//           if (response.success) {
//             this.storeAuthData(response);
//           }
//         })
//       );
//   }

//   login(loginData: LoginRequest): Observable<AuthResponse> {
//     return this.http.post<AuthResponse>(`${this.authUrl}/login`, loginData)
//       .pipe(
//         tap(response => {
//           if (response.success) {
//             this.storeAuthData(response);
//           }
//         })
//       );
//   }

//   logout(): Promise<void> {
//     return new Promise<void>((resolve, reject) => {
//       // Call logout API
//       this.http.post<any>(`${this.apiUrl}/auth/logout`, {})
//         .subscribe({
//           next: () => {
//             // Clear current user
//             this.currentUserSubject.next(null);
//             resolve();
//           },
//           error: (err) => {
//             console.warn('Logout API error:', err);
//             // Still clear the current user on error
//             this.currentUserSubject.next(null);
//             resolve(); // We resolve instead of reject to ensure logout continues
//           }
//         });
//     });
//   }

//   isLoggedIn(): boolean {
//     if (!this.isBrowser) return false;
    
//     const token = localStorage.getItem('token');
//     return token !== null && !this.jwtHelper.isTokenExpired(token);
//   }

//   getToken(): string | null {
//     if (!this.isBrowser) return null;
    
//     return localStorage.getItem('token');
//   }

//   hasRole(role: string): boolean {
//     const user = this.currentUserSubject.value;
//     return user !== null && user.roles === role;
//   }

//   getAllUsers(): Observable<User[]> {
//     return this.http.get<User[]>(`${this.apiUrl}/roles/users`);
//   }

//   updateUserRoles(userId: string, roles: string): Observable<any> {
//     return this.http.put(`${this.apiUrl}/roles/users/${userId}/roles`, { roles });
//   } 

//   private storeAuthData(response: AuthResponse): void {
//     if (this.isBrowser) {
//       localStorage.setItem('token', response.token);
//     }
//     this.currentUserSubject.next(response.user);
//   }

//   getRedirectUrl(): string {
//     const user = this.currentUserSubject.value;
//     // If user is admin, redirect to admin dashboard
//     if ( user && user.roles == 'Admin') {
//       return '/admindashboard';
//     }
//     // Otherwise, redirect to user profile
//     return '/userprofile';
//   }

//   forgetPassword(email: string) {
//     return this.http.post(`${this.apiUrl}/auth/forgot-password`, { email });
//   }

//   resetPassword(data: any) {
//     return this.http.post(`${this.apiUrl}/auth/reset-password`, data);
//   }
  
  

// }
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import { User, RegisterRequest, LoginRequest, AuthResponse } from '../models/user.model';
import { JwtHelperService } from '@auth0/angular-jwt';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5241/api';
  private authUrl = 'http://localhost:5241/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private jwtHelper = new JwtHelperService();
  private isBrowser: boolean;

  // Role-based routes
  private roleRoutes: { [key: string]: string } = {
    'Admin': '/admindashboard',
    'Business Owner': '/testbusinessowner',
    'Sales Manager': '/testsalesmanager',
    'Marketing Manager': '/testmarketingmanager',
    'Inventory Manager': 'testinventorymanager',
  };

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      this.loadStoredUser();
    }
  }

  private loadStoredUser(): void {
    if (!this.isBrowser) return;
    
    try {
      const token = localStorage.getItem('token');
      if (token && !this.jwtHelper.isTokenExpired(token)) {
        const decodedToken = this.jwtHelper.decodeToken(token);
        const user: User = {
          id: decodedToken.sub || decodedToken.nameid,
          username: decodedToken.unique_name || decodedToken.username,
          email: decodedToken.email,
          honeycombId: decodedToken.honeycombId || decodedToken.HoneyCombId,
          role: decodedToken.role || decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || decodedToken.role || 'User'
        };
        console.log('Created user object',user);//debug log
        this.currentUserSubject.next(user);
      } else if (token) {
        // Token exists but is expired
        this.clearAuthData();
      }
    } catch (error) {
      console.error('Error loading stored user:', error);
      this.clearAuthData();
    }
  }

  register(registerData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.authUrl}/register`, registerData)
      .pipe(
        tap(response => {
          if (response && response.success && response.token) {
            this.storeAuthData(response);
          }
        }),
        catchError(this.handleError)
      );
  }

  login(loginData: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.authUrl}/login`, loginData)
      .pipe(
        tap(response => {
          if (response && response.success && response.token) {
            this.storeAuthData(response);
          }
        }),
        catchError(this.handleError)
      );
  }

  logout(): Observable<any> {
    return this.http.post<any>(`${this.authUrl}/logout`, {})
      .pipe(
        tap(() => this.clearAuthData()),
        catchError(() => {
          this.clearAuthData();
          return throwError(() => new Error('Logout failed'));
        })
      );
  }

  private clearAuthData(): void {
    if (this.isBrowser) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    this.currentUserSubject.next(null);
  }

  private storeAuthData(response: AuthResponse): void {
    if (this.isBrowser && response.token) {
      localStorage.setItem('token', response.token);
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
      }
    }
    if (response.user) {
      this.currentUserSubject.next(response.user);
    }
  }

  isLoggedIn(): boolean {
    if (!this.isBrowser) return false;
    const token = localStorage.getItem('token');
    return token !== null && !this.jwtHelper.isTokenExpired(token);
  }

  getToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem('token');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user !== null && user.role === role;
  }

  hasAnyRole(roles: string[]): boolean {
    const user = this.getCurrentUser();
    return user !== null && roles.includes(user.role);
  }

  getCurrentUserRole(): string | null {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  }

  getRedirectUrl(): string {
  const user = this.getCurrentUser();
  console.log('Getting redirect URL for user:', user); // Debug log
  
  if (user && user.role) {
    const redirectUrl = this.roleRoutes[user.role];
    console.log(`Role: ${user.role}, Redirect URL: ${redirectUrl}`); // Debug log
    
    if (redirectUrl) {
      return redirectUrl;
    }
  }
  
  console.log('No matching role found, redirecting to login');
  return '/login'; 
}

  canAccessRoute(allowedRoles: string[]): boolean {
    const userRole = this.getCurrentUserRole();
    return userRole !== null && allowedRoles.includes(userRole);
  }

  getAvailableRoles(): string[] {
    return Object.keys(this.roleRoutes).filter(role => role !== 'Admin'); // Exclude Admin from available roles

  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/roles/users`)
      .pipe(catchError(this.handleError));
  }

  updateUserRoles(userId: string, roles: string[]): Observable<any> {
    return this.http.put(`${this.apiUrl}/roles/users/${userId}/roles`, { roles })
      .pipe(catchError(this.handleError));
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.authUrl}/forgot-password`, { email })
      .pipe(catchError(this.handleError));
  }

  resetPassword(data: any): Observable<any> {
    return this.http.post(`${this.authUrl}/reset-password`, data)
      .pipe(catchError(this.handleError));
  }

  private handleError = (error: HttpErrorResponse) => {
    let errorMessage = 'An unknown error occurred!';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.status === 401) {
        errorMessage = 'Invalid credentials. Please try again.';
        this.clearAuthData();
      } else if (error.status === 0) {
        errorMessage = 'Unable to connect to server. Please check your internet connection.';
      } else if (error.error && error.error.message) {
        errorMessage = error.error.message;
      } else {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
    }
    
    console.error('Auth Service Error:', error);
    return throwError(() => new Error(errorMessage));
  };
}