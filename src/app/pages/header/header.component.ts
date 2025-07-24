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
  profileImageSrc: string = 'assets/profile.jpg'; // Default image
  userName: string = '';
  userRole: string = '';
  isLoggedIn: boolean = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private profileImageService: ProfileImageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.profileImageService.profileImage$.subscribe(imageUrl => {
      this.profileImageSrc = imageUrl;
    });

    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isLoggedIn = !!user;

      if (user) {
        this.userName = user.username;
        this.userRole = user.Role; // Use correct casing based on your model
        if (user.id) {
          this.loadUserProfileImage(user.id);
        }
      } else {
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
            imageUrl = userDetails.profileImage;
          } else {
            imageUrl = `http://localhost:5241${userDetails.profileImage}`;
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

  getProfileImageSrc(): string {
    return this.profileImageSrc;
  }

  navigateToProfile(): void {
    this.router.navigate(['/userprofile']);
  }
}
