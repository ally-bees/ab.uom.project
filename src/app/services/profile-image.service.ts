import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileImageService {
  private profileImageSubject = new BehaviorSubject<string>('assets/profile.jpg');
  public profileImage$: Observable<string> = this.profileImageSubject.asObservable();

  constructor() {}

  // Update the profile image across all components
  updateProfileImage(imageUrl: string): void {
    this.profileImageSubject.next(imageUrl);
  }

  // Get the current profile image URL
  getCurrentProfileImage(): string {
    return this.profileImageSubject.value;
  }

  // Set default profile image
  setDefaultProfileImage(): void {
    this.profileImageSubject.next('assets/profile.jpg');
  }
}
