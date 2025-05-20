import { MatFormFieldModule } from '@angular/material/form-field';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,MatFormFieldModule],
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css']
})
export class UserProfileComponent implements OnInit {
  profileForm: FormGroup;
  maxDate!: string;
  minDate!: string;
  lastUpdate: string = new Date().toUTCString();
  activeSection: string = 'Edit Profile';
  currentUser: User | null = null;
 
  navigationItems = [
    { name: 'Edit Profile', active: true },
    { name: 'Notifications', active: false },
    { name: 'Dashboard', active: false },
    { name: 'Logout', active: false }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.email]],
      userName: [''],
      phoneCountryCode: ['+94'],
      phoneNumber: [''],
      dateOfBirth: [''],
      country: [''],
      address: [''],
      city: ['']
    });
  }
  

  ngOnInit() {
    
    // Set max date to today
    this.maxDate = new Date().toISOString().split('T')[0];
    
    // Set min date (e.g., 100 years ago)
    const minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - 100);
    this.minDate = minDate.toISOString().split('T')[0];
  
    // Subscribe to the current user observable
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      
      if (user) {
        // Populate the form with user data
        // Assuming the username contains first and last name separated by space
        const nameParts = user.username.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
        
        this.profileForm.patchValue({
          firstName: firstName,
          lastName: lastName,
          email: user.email,
          userName: user.username
        });
      }
    });
  }


  openDatePicker() {
    // This will trigger the native date picker
    document.getElementById('dateOfBirth')?.click();
  }

  onSave() {
    if (this.profileForm.valid) {
      console.log('Form submitted', this.profileForm.value);
      // Here you would typically call a service to update the profile
    } else {
      this.markFormGroupTouched(this.profileForm);
    }
  }
 
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
 
  setActiveSection(section: string) {
    this.activeSection = section;
    this.navigationItems.forEach(item => {
      item.active = item.name === section;
    });

    // navigation for Dashboard and Logout
    if (section === 'Dashboard') {
      this.navigateToDashboard();
    } else if (section === 'Logout') {
      this.logout();
    }
  }

  navigateToDashboard() {
    // Navigate to the dashboard 
    this.router.navigate(['/dashboard']);
  }

  logout() {
    try {
      // If authService.logout() returns a Promise
      this.authService.logout()
        .then(() => {
          // Clear any local storage items
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          sessionStorage.removeItem('token');
          
          // Force (more forceful redirect than router.navigate) navigation to login page
          window.location.href = '/login'; 
        })
        .catch(error => {
          console.error('Logout failed:', error);
          // Still try to redirect even if logout API fails
          window.location.href = '/login';
        });
    } catch (error) {
      console.error('Error during logout process:', error);
      
      // If the above fails for any reason, try direct navigation
      this.router.navigate(['/login']).then(success => {
        if (!success) {
          // If router navigation fails, use window.location as fallback
          window.location.href = '/login';
        }
      });
    }
  }

  imageSrc: string = 'assets/profile-placeholder.jpg';

  triggerFileInput(): void {
    const fileInput = document.querySelector<HTMLInputElement>('input[type="file"]');
    fileInput?.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageSrc = e.target.result; // base64 image preview
      };
      reader.readAsDataURL(input.files[0]);
    }
  }
}