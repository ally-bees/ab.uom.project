import { MatFormFieldModule } from '@angular/material/form-field';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
//import { UserService } from '../services/user.service';
import { UserService } from '../services/userProfile.service';

export interface UserDetails {
  id?: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  phoneCountryCode: string;
  phoneNumber: string;
  dateOfBirth: string;
  country: string;
  address: string;
  city: string;
  profileImage?: string;
}

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
  selectedFile: File | null = null;
  isLoading = false;
  saveMessage = '';
  saveSuccess = false;
 
  navigationItems = [
    { name: 'Edit Profile', active: true },
    { name: 'Notifications', active: false },
    { name: 'Dashboard', active: false },
    { name: 'Logout', active: false }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService : UserService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.email]],
      userName: [''],
      phoneCountryCode: ['+94'],
      phoneNumber: ['',[Validators.pattern(/^\d{9,10}$/)]],
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

  loadUserProfile(userId: string) {
    this.userService.getUserDetails(userId).subscribe({
      next: (userDetails: UserDetails) => {
        // Populate form with existing user details
        this.profileForm.patchValue({
          firstName: userDetails.firstName,
          lastName: userDetails.lastName,
          email: userDetails.email,
          userName: userDetails.userName,
          phoneCountryCode: userDetails.phoneCountryCode,
          phoneNumber: userDetails.phoneNumber,
          dateOfBirth: userDetails.dateOfBirth,
          country: userDetails.country,
          address: userDetails.address,
          city: userDetails.city
        });

        // Set profile image if exists
        if (userDetails.profileImage) {
          this.imageSrc = userDetails.profileImage;
        }
      },
      error: (error) => {
        console.log('No existing user details found, using defaults');
      }
    });
  }

  onSave() {
    if (this.profileForm.valid && this.currentUser) {
      this.isLoading = true;
      this.saveMessage = '';

      const userDetails: UserDetails = {
        userId: this.currentUser.id ?? '',
        firstName: this.profileForm.value.firstName,
        lastName: this.profileForm.value.lastName,
        email: this.profileForm.value.email,
        userName: this.profileForm.value.userName,
        phoneCountryCode: this.profileForm.value.phoneCountryCode,
        phoneNumber: this.profileForm.value.phoneNumber,
        dateOfBirth: this.profileForm.value.dateOfBirth,
        country: this.profileForm.value.country,
        address: this.profileForm.value.address,
        city: this.profileForm.value.city
      };

      // Save user details first
      this.userService.saveUserDetails(userDetails).subscribe({
        next: (response) => {
          console.log('User details saved successfully:', response);
          
          // If there's a selected file, upload it
          if (this.selectedFile) {
            this.uploadProfileImage();
          } else {
            this.showSuccessMessage('Profile saved successfully!');
            this.isLoading = false;
          }
        },
        error: (error) => {
          console.error('Error saving user details:', error);
          this.showErrorMessage('Failed to save profile. Please try again.');
          this.isLoading = false;
        }
      });
    } else {
      this.markFormGroupTouched(this.profileForm);
      this.showErrorMessage('Please fill in all required fields correctly.');
    }
  }

  uploadProfileImage() {
    if (this.selectedFile && this.currentUser) {
      this.userService.uploadProfileImage(this.currentUser.id!, this.selectedFile).subscribe({
        next: (response) => {
          console.log('Profile image uploaded successfully:', response);
          this.showSuccessMessage('Profile and image saved successfully!');
          this.selectedFile = null;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error uploading image:', error);
          this.showErrorMessage('Profile saved, but image upload failed.');
          this.isLoading = false;
        }
      });
    } else {
      this.isLoading = false;
    }
  }

  showSuccessMessage(message: string) {
    this.saveMessage = message;
    this.saveSuccess = true;
    setTimeout(() => {
      this.saveMessage = '';
    }, 3000);
  }

  showErrorMessage(message: string) {
    this.saveMessage = message;
    this.saveSuccess = false;
    setTimeout(() => {
      this.saveMessage = '';
    }, 3000);
  }


  openDatePicker() {
    // This will trigger the native date picker
    document.getElementById('dateOfBirth')?.click();
  }

  // onSave() {
  //   if (this.profileForm.valid) {
  //     console.log('Form submitted', this.profileForm.value);
  //     // Here you would typically call a service to update the profile
  //   } else {
  //     this.markFormGroupTouched(this.profileForm);
  //   }
  // }
 
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
      // If authService.logout() returns an Observable
      this.authService.logout()
        .subscribe({
          next: () => {
            // Clear any local storage items
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');
            
            // Force (more forceful redirect than router.navigate) navigation to login page
            window.location.href = '/login'; 
          },
          error: (error) => {
            console.error('Logout failed:', error);
            // Still try to redirect even if logout API fails
            window.location.href = '/login';
          }
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