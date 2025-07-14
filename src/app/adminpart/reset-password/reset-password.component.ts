

import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PasswordResetService } from '../../services/password-reset.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  resetForm: FormGroup;
  loading = false;
  submitted = false;
  errorMessage = '';
  successMessage = '';
  tokenInvalid = false;
  resetToken = '';
  email = '';
  private redirectTimer: any;

  constructor(
    private formBuilder: FormBuilder,
    private passwordResetService: PasswordResetService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {
    this.resetForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { 
      validators: this.passwordMatchValidator 
    });
  }

  ngOnInit(): void {
    // Get token and email from URL parameters
    this.route.queryParams.subscribe(params => {
      this.resetToken = params['token'];
      this.email = params['email'];
      
      console.log('🔍 Reset token from URL:', this.resetToken);
      console.log('🔍 Email from URL:', this.email);
      
      if (!this.resetToken) {
        console.error('❌ No reset token found in URL');
        this.tokenInvalid = true;
      }
      
      if (!this.email) {
        console.error('❌ No email found in URL');
        this.tokenInvalid = true;
      }
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else {
      if (confirmPassword?.errors?.['passwordMismatch']) {
        delete confirmPassword.errors['passwordMismatch'];
        if (Object.keys(confirmPassword.errors).length === 0) {
          confirmPassword.setErrors(null);
        }
      }
    }
    return null;
  }

  get password() { return this.resetForm.get('password'); }
  get confirmPassword() { return this.resetForm.get('confirmPassword'); }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';
    this.successMessage = '';

    console.log('🔍 Form valid:', this.resetForm.valid);
    console.log('🔍 Form values:', this.resetForm.value);

    if (this.resetForm.invalid) {
      console.log('❌ Form is invalid');
      this.markFormGroupTouched(this.resetForm);
      return;
    }

    if (!this.resetToken || !this.email) {
      this.errorMessage = 'Invalid reset link. Please request a new password reset.';
      return;
    }

    this.loading = true;

    const resetData = {
      token: this.resetToken,
      email: this.email,
      newPassword: this.resetForm.value.password,
      confirmPassword: this.resetForm.value.confirmPassword
    };

    console.log('🔍 Sending reset request:', { ...resetData, newPassword: '*****', confirmPassword: '*****' });

    this.passwordResetService.resetPassword(resetData).subscribe({
      next: (response) => {
        console.log('✅ Password reset successful:', response);
        this.loading = false;
        this.successMessage = 'Password reset successfully! Redirecting to login...';
        
        // Clear any cached auth data to ensure clean state
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        
        // Redirect to login after 2 seconds with a more reliable method
        this.redirectTimer = setTimeout(() => {
          this.performRedirect();
        }, 2000);
      },
      error: (error) => {
        console.error('❌ Password reset error:', error);
        this.loading = false;
        
        if (error.status === 400 && error.error?.message) {
          this.errorMessage = error.error.message;
        } else if (error.status === 404) {
          this.errorMessage = 'Reset service not found. Please contact support.';
        } else if (error.status === 0) {
          this.errorMessage = 'Unable to connect to server. Please check your internet connection.';
        } else {
          this.errorMessage = 'Something went wrong. Please try again or request a new reset link.';
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.redirectTimer) {
      clearTimeout(this.redirectTimer);
    }
  }

  private performRedirect(): void {
    console.log('🔍 Performing redirect to login...');
    
    // Method 1: Try Angular router with replace
    this.router.navigate(['/login'], { 
      replaceUrl: true,
      queryParams: { 
        message: 'Password reset successful. Please login with your new password.' 
      }
    }).then((navigationSuccess) => {
      console.log('🔍 Angular navigation success:', navigationSuccess);
      if (navigationSuccess) {
        // Clear the current route from history
        this.location.replaceState('/login');
        // Small delay then reload to ensure clean state
        setTimeout(() => {
          console.log('🔍 Reloading page for clean state...');
          window.location.reload();
        }, 100);
      } else {
        this.fallbackRedirect();
      }
    }).catch((error) => {
      console.error('❌ Angular navigation error:', error);
      this.fallbackRedirect();
    });
  }

  private fallbackRedirect(): void {
    console.log('🔍 Using fallback redirect method...');
    // Clear any authentication data
    localStorage.clear();
    sessionStorage.clear();
    
    // Direct URL navigation as fallback
    window.location.href = window.location.origin + '/login?message=' + 
      encodeURIComponent('Password reset successful. Please login with your new password.');
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
