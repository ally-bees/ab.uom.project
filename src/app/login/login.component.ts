
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,RouterModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // If already logged in, redirect to appropriate dashboard
    if (this.authService.isLoggedIn()) {
      const redirectUrl = this.authService.getRedirectUrl();
      this.router.navigate([redirectUrl]);
    }

    // Initialize reactive form
    this.loginForm = this.formBuilder.group({
      userEmail: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Getter for easy access to form fields
  get f() { 
    return this.loginForm.controls; 
  }

  onSubmit(): void {
    // Clear previous error
    this.error = '';

    // Return if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    // Prepare login data
    const loginData = {
      email: this.loginForm.value.userEmail,
      password: this.loginForm.value.password
    };

    this.authService.login(loginData).subscribe({
      next: (response) => {
        this.loading = false;
        
        if (response && response.success) {
          console.log('Login successful:', response);
          
          // Get redirect URL based on user role
          const redirectUrl = this.authService.getRedirectUrl();
          
          // Navigate to appropriate dashboard
          this.router.navigate([redirectUrl]).then(() => {
            console.log('Navigation successful to:', redirectUrl);
          });
        } else {
          this.error = response?.message || 'Login failed. Please try again.';
        }
      },
      error: (error) => {
        this.loading = false;
        console.error('Login error:', error);
        this.error = error.message || 'Login failed. Please check your credentials.';
      }
    });
  }
}