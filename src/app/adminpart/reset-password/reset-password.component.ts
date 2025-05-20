// import { Component } from '@angular/core';
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { AuthService } from '../../services/auth.service'; // adjust path if needed
// import { ActivatedRoute, Router } from '@angular/router';
// import { CommonModule } from '@angular/common';


// @Component({
//   selector: 'app-reset-password',
//   standalone:true,
//   imports: [CommonModule,ReactiveFormsModule],
//   templateUrl: './reset-password.component.html',
//   styleUrls: ['./reset-password.component.css']
// })
// export class ResetPasswordComponent {
//   resetForm: FormGroup;
//   token: string = '';

//   constructor(
//     private fb: FormBuilder,
//     private authService: AuthService,
//     private route: ActivatedRoute,
//     private router: Router
//   ) {
//     this.resetForm = this.fb.group({
//       newPassword: ['', [Validators.required, Validators.minLength(6)]],
//       confirmPassword: ['', Validators.required]
//     });
//   }

//   ngOnInit() {
//     this.route.queryParams.subscribe(params => {
//       this.token = params['token'];
//     });
//   }

//   onSubmit() {
//     if (this.resetForm.invalid) {
//       return;
//     }

//     if (this.resetForm.value.newPassword !== this.resetForm.value.confirmPassword) {
//       alert('Passwords do not match!');
//       return;
//     }

//     const data = {
//       token: this.token,
//       newPassword: this.resetForm.value.newPassword
//     };

//     this.authService.resetPassword(data).subscribe({
//       next: () => {
//         alert('Password reset successful!');
//         this.router.navigate(['/login']);
//       },
//       error: () => {
//         alert('Password reset failed. Token may be invalid or expired.');
//       }
//     });
//   }
// }


import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service'; // adjust path as needed
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  submitted = false;
  loading = false;
  successMessage = '';
  errorMessage = '';
  token: string = '';
  tokenInvalid = false;

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService, 
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit(): void {
    // Get token from the URL query parameters
    this.route.queryParams.subscribe(params => {
      if (params['token']) {
        this.token = params['token'];
      } else {
        // If no token is provided, show error
        this.tokenInvalid = true;
        this.errorMessage = 'Invalid password reset link. Please request a new one.';
      }
    });
  }

  // Custom validator to check if passwords match
  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      formGroup.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      formGroup.get('confirmPassword')?.setErrors(null);
      return null;
    }
  }

  get password() {
    return this.resetForm.get('password');
  }

  get confirmPassword() {
    return this.resetForm.get('confirmPassword');
  }

  onSubmit() {
    this.submitted = true;
    if (this.resetForm.invalid || this.tokenInvalid) {
      return;
    }

    this.loading = true;
    const data = {
      token: this.token,
      newPassword: this.password?.value
    };

    this.authService.resetPassword(data).subscribe({
      next: (response: any) => {
        this.successMessage = 'Password has been reset successfully!';
        this.loading = false;
        this.errorMessage = '';
        
        // Redirect to login page after 3 seconds
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Something went wrong. Please try again.';
        this.loading = false;
        this.successMessage = '';
      }
    });
  }
}