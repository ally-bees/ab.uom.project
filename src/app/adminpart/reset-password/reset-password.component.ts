
// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { AuthService } from '../../services/auth.service'; // adjust path as needed
// import { ActivatedRoute, Router, RouterLink } from '@angular/router';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-reset-password',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule, RouterLink],
//   templateUrl: './reset-password.component.html',
//   styleUrls: ['./reset-password.component.css']
// })
// export class ResetPasswordComponent implements OnInit {
//   resetForm: FormGroup;
//   submitted = false;
//   loading = false;
//   successMessage = '';
//   errorMessage = '';
//   token: string = '';
//   tokenInvalid = false;

//   constructor(
//     private fb: FormBuilder, 
//     private authService: AuthService, 
//     private route: ActivatedRoute,
//     private router: Router
//   ) {
//     this.resetForm = this.fb.group({
//       password: ['', [Validators.required, Validators.minLength(6)]],
//       confirmPassword: ['', Validators.required]
//     }, {
//       validators: this.passwordMatchValidator
//     });
//   }

//   ngOnInit(): void {
//     // Get token from the URL query parameters
//     this.route.queryParams.subscribe(params => {
//       if (params['token']) {
//         this.token = params['token'];
//       } else {
//         // If no token is provided, show error
//         this.tokenInvalid = true;
//         this.errorMessage = 'Invalid password reset link. Please request a new one.';
//       }
//     });
//   }

//   // Custom validator to check if passwords match
//   passwordMatchValidator(formGroup: FormGroup) {
//     const password = formGroup.get('password')?.value;
//     const confirmPassword = formGroup.get('confirmPassword')?.value;

//     if (password !== confirmPassword) {
//       formGroup.get('confirmPassword')?.setErrors({ passwordMismatch: true });
//       return { passwordMismatch: true };
//     } else {
//       formGroup.get('confirmPassword')?.setErrors(null);
//       return null;
//     }
//   }

//   get password() {
//     return this.resetForm.get('password');
//   }

//   get confirmPassword() {
//     return this.resetForm.get('confirmPassword');
//   }

//   onSubmit() {
//     this.submitted = true;
//     if (this.resetForm.invalid || this.tokenInvalid) {
//       return;
//     }

//     this.loading = true;
//     const data = {
//       token: this.token,
//       newPassword: this.password?.value
//     };

//     this.authService.resetPassword(data).subscribe({
//       next: (response: any) => {
//         this.successMessage = 'Password has been reset successfully!';
//         this.loading = false;
//         this.errorMessage = '';
        
//         // Redirect to login page after 3 seconds
//         setTimeout(() => {
//           this.router.navigate(['/login']);
//         }, 3000);
//       },
//       error: (err) => {
//         this.errorMessage = err.error?.message || 'Something went wrong. Please try again.';
//         this.loading = false;
//         this.successMessage = '';
//       }
//     });
//   }
// }


// reset-password.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PasswordResetService } from '../../services/password-reset.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  loading = false;
  submitted = false;
  errorMessage = '';
  successMessage = '';
  tokenInvalid = false;
  resetToken = '';
  email = '';

  constructor(
    private formBuilder: FormBuilder,
    private passwordResetService: PasswordResetService,
    private route: ActivatedRoute,
    private router: Router
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
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
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
