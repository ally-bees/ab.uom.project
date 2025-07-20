
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { AuthResponse } from '../models/user.model';
import { interval, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  signupForm!: FormGroup;
  otpForm!: FormGroup;
  loading = false;
  error = '';
  availableRoles: string[] = [];
  
  // OTP related properties
  showOtpStep = false;
  email = '';
  otpSent = false;
  resendDisabled = false;
  resendCountdown = 0;
  private countdownSubscription?: Subscription;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Get available roles from auth service (excludes Admin)
    this.availableRoles = this.authService.getAvailableRoles();

    this.signupForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      honeycombId: ['', Validators.required]
    },{
      validators: this.mustMatch('password', 'confirmPassword')
    });

    this.otpForm = this.fb.group({
      otpCode: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern(/^\d{6}$/)]]
    });

    // If user is already logged in, redirect to their appropriate dashboard
    if (this.authService.isLoggedIn()) {
      this.router.navigate([this.authService.getRedirectUrl()]);
    }
  }

  ngOnDestroy(): void {
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
  }

  get f() {
    return this.signupForm.controls;
  }

  get otpF() {
    return this.otpForm.controls;
  }

  onSubmit(): void {
    if (this.signupForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';

    // Step 1: Initiate registration (send OTP)
    this.authService.initiateRegistration(this.signupForm.value).subscribe({
      next: (response: AuthResponse) => {
        if (response.requiresOtpVerification) {
          this.email = this.signupForm.value.email;
          this.showOtpStep = true;
          this.otpSent = true;
          this.startResendCountdown();
          this.loading = false;
        } else {
          // Fallback to old registration if OTP not required
          const redirectUrl = this.authService.getRedirectUrl();
          this.router.navigate([redirectUrl]);
        }
      },
      error: (err: any) => {
        this.error = err?.error?.message || 'Registration failed. Please try again.';
        this.loading = false;
      }
    });
  }

  onOtpSubmit(): void {
    if (this.otpForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';

    const otpData = {
      email: this.email,
      otpCode: this.otpForm.value.otpCode,
      purpose: 'SIGNUP'
    };

    // Step 2: Complete registration with OTP verification
    this.authService.completeRegistration(otpData).subscribe({
      next: (response: AuthResponse) => {
        // Registration successful, redirect based on user role
        const redirectUrl = this.authService.getRedirectUrl();
        console.log('Registration completed successfully, redirecting to:', redirectUrl);
        this.router.navigate([redirectUrl]);
      },
      error: (err: any) => {
        this.error = err?.error?.message || 'Invalid verification code. Please try again.';
        this.loading = false;
      }
    });
  }

  resendOtp(): void {
    if (this.resendDisabled) {
      return;
    }

    this.loading = true;
    this.error = '';

    const otpRequestData = {
      email: this.email,
      purpose: 'SIGNUP'
    };

    this.authService.resendOtp(otpRequestData).subscribe({
      next: (response: AuthResponse) => {
        this.startResendCountdown();
        this.loading = false;
        // You could show a success message here if desired
      },
      error: (err: any) => {
        this.error = err?.error?.message || 'Failed to resend verification code.';
        this.loading = false;
      }
    });
  }

  goBackToSignup(): void {
    this.showOtpStep = false;
    this.otpSent = false;
    this.email = '';
    this.otpForm.reset();
    this.error = '';
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
  }

  private startResendCountdown(): void {
    this.resendDisabled = true;
    this.resendCountdown = 60; // 60 seconds countdown

    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }

    this.countdownSubscription = interval(1000)
      .pipe(take(60))
      .subscribe({
        next: () => {
          this.resendCountdown--;
          if (this.resendCountdown <= 0) {
            this.resendDisabled = false;
          }
        },
        complete: () => {
          this.resendDisabled = false;
          this.resendCountdown = 0;
        }
      });
  }

  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        // return if another validator has already found an error on the matchingControl
        return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }
}