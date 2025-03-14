
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface User {
  name: string;
  email: string;
  role: string;
  lastActive: string;
  status: string;
}

@Component({
  selector: 'app-user-management',
  standalone:true,
  imports:[CommonModule,FormsModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [
    {
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Admin',
      lastActive: '2024-12-28 10:30:00',
      status: 'Active'
    },
    {
      name: 'John Smith',
      email: 'johnsmt@example.com',
      role: 'User',
      lastActive: '2024-12-28 10:30:00',
      status: 'Active'
    },
    {
      name: 'godzila',
      email: 'godzl@example.com',
      role: 'Owner',
      lastActive: '2024-12-28 10:30:00',
      status: 'Active'
    }
  ];

  searchText: string = '';

  constructor() { }

  ngOnInit(): void {
  }

  addUser(): void {
    // Implement add user functionality
    console.log('Add user clicked');
  }
}