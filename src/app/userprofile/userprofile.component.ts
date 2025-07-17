import { MatFormFieldModule } from '@angular/material/form-field';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { UserService } from '../services/userProfile.service';
import { ProfileImageService } from '../services/profile-image.service';

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
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatFormFieldModule],
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

  // New properties for image URL option
  showImageUrlInput = false;
  imageUrlInput = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService : UserService,
    private profileImageService: ProfileImageService,
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
      
      if (user && user.id) {
        // Load user details from the backend
        this.loadUserProfile(user.id);
        
        // Populate the form with basic user data
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
          dateOfBirth: userDetails.dateOfBirth ? new Date(userDetails.dateOfBirth).toISOString().split('T')[0] : '',
          country: userDetails.country,
          address: userDetails.address,
          city: userDetails.city
        });

        // Set profile image if exists
        if (userDetails.profileImage) {
          if (userDetails.profileImage.startsWith('http')) {
            this.imageSrc = userDetails.profileImage; // External URL
            this.profileImageService.updateProfileImage(userDetails.profileImage);
          } else {
            this.imageSrc = `http://localhost:5241${userDetails.profileImage}`; // Local file
            this.profileImageService.updateProfileImage(`http://localhost:5241${userDetails.profileImage}`);
          }
        }
      },
      error: (error) => {
        console.log('No existing user details found, using defaults');
        // If no user details exist, that's okay - they can create new ones
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
          // Update navbar with the new image URL
          if (response.imageUrl) {
            const fullImageUrl = response.imageUrl.startsWith('http') ? 
              response.imageUrl : `http://localhost:5241${response.imageUrl}`;
            this.profileImageService.updateProfileImage(fullImageUrl);
          }
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
    // Navigate based on user role
    if (this.currentUser && this.currentUser.Role) {
      const redirectUrl = this.authService.getRedirectUrl();
      this.router.navigate([redirectUrl]);
    } else {
      // Default dashboard if no role is found
      this.router.navigate(['/dashboard']);
    }
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
      const file = input.files[0];
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        this.showErrorMessage('Please select a valid image file (JPG, PNG, or GIF)');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.showErrorMessage('File size too large. Maximum size is 5MB.');
        return;
      }
      
      this.selectedFile = file; // Store the selected file
      
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageSrc = e.target.result; // base64 image preview
        // Update the navbar profile image immediately with preview
        this.profileImageService.updateProfileImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  toggleImageUrlInput(): void {
    this.showImageUrlInput = !this.showImageUrlInput;
    if (!this.showImageUrlInput) {
      this.imageUrlInput = '';
    }
  }

  setImageFromUrl(): void {
    if (this.imageUrlInput && this.currentUser) {
      // Validate URL format
      try {
        new URL(this.imageUrlInput);
      } catch (e) {
        this.showErrorMessage('Please enter a valid URL');
        return;
      }

      this.isLoading = true;
      this.userService.setProfileImageUrl(this.currentUser.id!, this.imageUrlInput).subscribe({
        next: (response) => {
          console.log('Profile image URL saved successfully:', response);
          this.imageSrc = this.imageUrlInput;
          // Update navbar with the new image URL
          this.profileImageService.updateProfileImage(this.imageUrlInput);
          this.showSuccessMessage('Profile image updated successfully!');
          this.showImageUrlInput = false;
          this.imageUrlInput = '';
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error setting image URL:', error);
          this.showErrorMessage('Failed to update profile image. Please try again.');
          this.isLoading = false;
        }
      });
    } else {
      this.showErrorMessage('Please enter a valid image URL');
    }
  }

  // Updated image source handling
  getImageSrc(): string {
    if (this.imageSrc.startsWith('http')) {
      return this.imageSrc; // External URL
    } else if (this.imageSrc.startsWith('/uploads')) {
      return `http://localhost:5241${this.imageSrc}`; // Local file
    } else {
      return this.imageSrc; // Base64 or default
    }
  }
}