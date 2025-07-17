import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/userProfile.service';
import { ProfileImageService } from '../../services/profile-image.service';
import { User } from '../../models/user.model';

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
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  currentUser: User | null = null;
  profileImageSrc: string = 'assets/profile.jpg'; // Default fallback image

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private profileImageService: ProfileImageService,
    private router: Router
  ) {}

  ngOnInit() {
    // Subscribe to profile image changes
    this.profileImageService.profileImage$.subscribe(imageUrl => {
      this.profileImageSrc = imageUrl;
    });

    // Subscribe to the current user observable
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      
      if (user && user.id) {
        // Load user profile image
        this.loadUserProfileImage(user.id);
      } else {
        // Reset to default if no user
        this.profileImageService.setDefaultProfileImage();
      }
    });
  }

  loadUserProfileImage(userId: string) {
    this.userService.getUserDetails(userId).subscribe({
      next: (userDetails: UserDetails) => {
        if (userDetails.profileImage) {
          let imageUrl: string;
          if (userDetails.profileImage.startsWith('http')) {
            imageUrl = userDetails.profileImage; // External URL
          } else {
            imageUrl = `http://localhost:5241${userDetails.profileImage}`; // Local file
          }
          this.profileImageService.updateProfileImage(imageUrl);
        } else {
          this.profileImageService.setDefaultProfileImage();
        }
      },
      error: (error) => {
        console.log('No profile image found, using default');
        this.profileImageService.setDefaultProfileImage();
      }
    });
  }

  // Method to get the correct image source
  getProfileImageSrc(): string {
    return this.profileImageSrc;
  }

  // Navigate to user profile when profile image is clicked
  navigateToProfile(): void {
    this.router.navigate(['/userprofile']);
  }
}