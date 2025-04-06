import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css']
})
export class UserProfileComponent {
  profileForm: FormGroup;
  lastUpdate: string = 'August 1';
  activeSection: string = 'Edit Profile';
  
  navigationItems = [
    { name: 'Edit Profile', active: true },
    { name: 'Notifications', active: false },
    { name: 'Choose Plan', active: false },
    { name: 'Password & Security', active: false }
  ];

  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      firstName: ['mobina', Validators.required],
      lastName: ['Mir', Validators.required],
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
  }
}