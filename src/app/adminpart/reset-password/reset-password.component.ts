import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service'; // adjust path if needed
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-reset-password',
  standalone:true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  resetForm: FormGroup;
  token: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
    });
  }

  onSubmit() {
    if (this.resetForm.invalid) {
      return;
    }

    if (this.resetForm.value.newPassword !== this.resetForm.value.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const data = {
      token: this.token,
      newPassword: this.resetForm.value.newPassword
    };

    this.authService.resetPassword(data).subscribe({
      next: () => {
        alert('Password reset successful!');
        this.router.navigate(['/login']);
      },
      error: () => {
        alert('Password reset failed. Token may be invalid or expired.');
      }
    });
  }
}
