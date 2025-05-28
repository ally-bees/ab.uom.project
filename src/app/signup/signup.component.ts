// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
// import { Router, RouterLink } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { AuthService } from '../services/auth.service';

// @Component({
//   selector: 'app-signup',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule,RouterLink],
//   templateUrl: './signup.component.html',
//   styleUrls: ['./signup.component.css']
// })
// export class SignupComponent implements OnInit {
//   signupForm!: FormGroup;
//   loading = false;
//   error = '';

//   constructor(
//     private fb: FormBuilder,
//     private router: Router,
//     private authService: AuthService
//   ) {}

//   ngOnInit(): void {
//     this.signupForm = this.fb.group({
//       username: ['', [Validators.required, Validators.minLength(3)]],
//       email: ['', [Validators.required, Validators.email]],
//       password: ['', [Validators.required, Validators.minLength(8)]],
//       role: ['', Validators.required],
//       honeycombId: ['', Validators.required]
//     });
  
//     if (this.authService.isLoggedIn()) {
//       // Use the auth service to decide where to redirect
//       this.router.navigate([this.authService.getRedirectUrl()]);
//     }
//   }

//   get f() {
//     return this.signupForm.controls;
//   }

//   onSubmit(): void {
//     if (this.signupForm.invalid) {
//       return;
//     }
  
//     this.loading = true;
//     this.error = '';
  
//     this.authService.register(this.signupForm.value).subscribe({
//       next: () => {
//         // Redirect to user profile instead
//         this.router.navigate(['/userprofile']);
//       },
//       error: (err) => {
//         this.error = err?.error?.message || 'Registration failed. Please try again.';
//         this.loading = false;
//       }
//     });
//   }
// }

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  loading = false;
  error = '';
  availableRoles: string[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Get available roles from auth service (excludes Admin)
    this.availableRoles = this.authService.getAvailableRoles();

    this.signupForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      role: ['', Validators.required],
      honeycombId: ['', Validators.required]
    });

    // If user is already logged in, redirect to their appropriate dashboard
    if (this.authService.isLoggedIn()) {
      this.router.navigate([this.authService.getRedirectUrl()]);
    }
  }

  get f() {
    return this.signupForm.controls;
  }

  onSubmit(): void {
    if (this.signupForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.register(this.signupForm.value).subscribe({
      next: (response) => {
        // After successful registration, redirect based on user role
        const redirectUrl = this.authService.getRedirectUrl();
        console.log('Redirecting to:', redirectUrl);
        this.router.navigate([redirectUrl]);
      },
      error: (err) => {
        this.error = err?.error?.message || 'Registration failed. Please try again.';
        this.loading = false;
      }
    });
  }
}