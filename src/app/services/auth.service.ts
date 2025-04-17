
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User, RegisterRequest, LoginRequest, AuthResponse } from '../models/user.model';
import { JwtHelperService } from '@auth0/angular-jwt';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5241/api';  // Base API URL without /auth
  private authUrl = 'http://localhost:5241/api/auth'; // Auth specific URL
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private jwtHelper = new JwtHelperService();
  private isBrowser: boolean;

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
    
    const token = localStorage.getItem('token');
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      console.log('Decoded token:', decodedToken); // Add this for debugging
      
      const user: User = {
        id: decodedToken.sub,
        username: decodedToken.username,
        email: decodedToken.email,
        honeycombId: decodedToken.honeycombId,
        roles: decodedToken.role || decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] // Try both formats
      };
      this.currentUserSubject.next(user);
    }
  }

  register(registerData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.authUrl}/register`, registerData)
      .pipe(
        tap(response => {
          if (response.success) {
            this.storeAuthData(response);
          }
        })
      );
  }

  login(loginData: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.authUrl}/login`, loginData)
      .pipe(
        tap(response => {
          if (response.success) {
            this.storeAuthData(response);
          }
        })
      );
  }

  logout(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      // Call your logout API if available
      this.http.post<any>(`${this.apiUrl}/auth/logout`, {})
        .subscribe({
          next: () => {
            // Clear current user
            this.currentUserSubject.next(null);
            resolve();
          },
          error: (err) => {
            console.warn('Logout API error:', err);
            // Still clear the current user on error
            this.currentUserSubject.next(null);
            resolve(); // We resolve instead of reject to ensure logout continues
          }
        });
    });
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

  hasRole(role: string): boolean {
    const user = this.currentUserSubject.value;
    return user !== null && user.roles === role;
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/roles/users`);
  }

  updateUserRoles(userId: string, roles: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/roles/users/${userId}/roles`, { roles });
  } 

  private storeAuthData(response: AuthResponse): void {
    if (this.isBrowser) {
      localStorage.setItem('token', response.token);
    }
    this.currentUserSubject.next(response.user);
  }

  getRedirectUrl(): string {
    const user = this.currentUserSubject.value;
    // If user is admin, redirect to admin dashboard
    if (user && user.roles === 'Admin') {
      return '/admindashboard';
    }
    // Otherwise, redirect to user profile
    return '/userprofile';
  }

}