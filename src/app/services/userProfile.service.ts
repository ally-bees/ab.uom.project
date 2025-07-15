import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

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

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:5241/api/userprofile'; // Update with your backend URL

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Save or update user details
  saveUserDetails(userDetails: UserDetails): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/details`, userDetails, {
      headers: this.getHeaders()
    });
  }

  // Get user details
  getUserDetails(userId: string): Observable<UserDetails> {
    return this.http.get<UserDetails>(`${this.apiUrl}/user/details/${userId}`, {
      headers: this.getHeaders()
    });
  }

  // Update user details
  updateUserDetails(userId: string, userDetails: UserDetails): Observable<any> {
    return this.http.put(`${this.apiUrl}/user/details/${userId}`, userDetails, {
      headers: this.getHeaders()
    });
  }

  // Upload profile image
  uploadProfileImage(userId: string, imageFile: File): Observable<any> {
    const formData = new FormData();
    formData.append('profileImage', imageFile);
    
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(`${this.apiUrl}/user/upload-image/${userId}`, formData, {
      headers: headers
    });
  }

  // Set profile image URL
  setProfileImageUrl(userId: string, imageUrl: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/image-url/${userId}`, { imageUrl }, {
      headers: this.getHeaders()
    });
  }
}