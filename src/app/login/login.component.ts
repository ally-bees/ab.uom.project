import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  error = '';
  returnUrl!: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}



  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      userEmail: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  
    // Update the default returnUrl to use the auth service
    if (this.authService.isLoggedIn()) {
      this.router.navigate([this.authService.getRedirectUrl()]);
    }
  }


  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }
  
    this.loading = true;
    this.error = '';
  
    this.authService.login({
      email: this.f['userEmail'].value,
      password: this.f['password'].value
    }).subscribe({
      next: () => {
        // Use the redirect function instead of hardcoded route
        this.router.navigate([this.authService.getRedirectUrl()]);
      },
      error: error => {
        this.error = error?.error?.message || 'Login failed. Please check your credentials.';
        this.loading = false;
      }
    });
  
  }

  // create onsubmit method to handle role based redirection
  // onSubmit(): void { 
  //   if (this.loginForm.invalid) {
  //     return;
  //   }
  //   this.loading = true;
  //   this.error = '';
  //   this.authService.login(this.loginForm.value).subscribe({
  //     next: () => {
  //       let user: any;
  //       this.authService.currentUser$.subscribe(currentUser => user = currentUser);
  //       if (user && user.roles === 'admin') {
  //         this.router.navigate(['/admindashboard']);
  //       } else if (user && user.roles === 'user') {
  //         this.router.navigate(['/userprofile']);
  //       } else {
  //         this.router.navigate(['/login']);
  //       }
  //     },
  //     error: (err) => {
  //       this.error = err?.error?.message || 'Login failed. Please check your credentials.';
  //       this.loading = false;
  //     }
  //   });
  // }

}
