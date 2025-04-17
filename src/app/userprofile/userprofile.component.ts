
// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { AuthService } from '../services/auth.service';
// import { User } from '../models/user.model';

// @Component({
//   selector: 'app-user-profile',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule],
//   templateUrl: './userprofile.component.html',
//   styleUrls: ['./userprofile.component.css']
// })
// export class UserProfileComponent implements OnInit {
//   profileForm: FormGroup;
//   lastUpdate: string = 'August 1';
//   activeSection: string = 'Edit Profile';
//   currentUser: User | null = null;
 
//   navigationItems = [
//     { name: 'Edit Profile', active: true },
//     { name: 'Notifications', active: false },
//     { name: 'Dashboard', active: false },
//     { name: 'Logout', active: false }
//   ];

//   constructor(
//     private fb: FormBuilder,
//     private authService: AuthService
//   ) {
//     this.profileForm = this.fb.group({
//       firstName: ['', Validators.required],
//       lastName: ['', Validators.required],
//       email: ['', [Validators.email]],
//       userName: [''],
//       phoneCountryCode: ['+94'],
//       phoneNumber: [''],
//       dateOfBirth: [''],
//       country: [''],
//       address: [''],
//       city: ['']
//     });
//   }

//   ngOnInit() {
//     // Subscribe to the current user observable
//     this.authService.currentUser$.subscribe(user => {
//       this.currentUser = user;
      
//       if (user) {
//         // Populate the form with user data
//         // Assuming the username contains first and last name separated by space
//         const nameParts = user.username.split(' ');
//         const firstName = nameParts[0] || '';
//         const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
        
//         this.profileForm.patchValue({
//           firstName: firstName,
//           lastName: lastName,
//           email: user.email,
//           userName: user.username
//         });
//       }
//     });
//   }

//   onSave() {
//     if (this.profileForm.valid) {
//       console.log('Form submitted', this.profileForm.value);
//       // Here you would typically call a service to update the profile
//     } else {
//       this.markFormGroupTouched(this.profileForm);
//     }
//   }
 
//   markFormGroupTouched(formGroup: FormGroup) {
//     Object.values(formGroup.controls).forEach(control => {
//       control.markAsTouched();
//       if (control instanceof FormGroup) {
//         this.markFormGroupTouched(control);
//       }
//     });
//   }
 
//   setActiveSection(section: string) {
//     this.activeSection = section;
//     this.navigationItems.forEach(item => {
//       item.active = item.name === section;
//     });
//   }
  
  
// }

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css']
})
export class UserProfileComponent implements OnInit {
  profileForm: FormGroup;
  lastUpdate: string = 'August 1';
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

    // Handle navigation for Dashboard and Logout
    if (section === 'Dashboard') {
      this.navigateToDashboard();
    } else if (section === 'Logout') {
      this.logout();
    }
  }

  navigateToDashboard() {
    // Navigate to the dashboard route
    this.router.navigate(['/dashboard']);
  }

  logout() {
    // First attempt to use the AuthService's logout method
    try {
      // If your authService.logout() returns a Promise
      this.authService.logout()
        .then(() => {
          // Clear any local storage items
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          sessionStorage.removeItem('token');
          
          // Force navigation to login page
          window.location.href = '/login'; // This is a more forceful redirect than router.navigate
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
}