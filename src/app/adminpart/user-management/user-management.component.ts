
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from "../../pages/header/header.component";
import { FooterComponent } from '../../footer/footer.component';
import { UserService } from '../../services/user.service';

interface User {
  username: string;
  email: string;
  roles: string;
  lastActive: string;
  createdAt: string;
  status?: string;
  showMenu?: boolean; // for dropdown menu
  HoneyCombId: string;
}

interface UserCreate {
  username: string;
  email: string;
  roles: string;
  HoneyCombId: string;
  password: string; 
  status: string;
  createdAt: string;
  lastActive: string;
}

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  searchText: string = '';

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getUsers().subscribe((data) => {
      this.users = data.map(user => ({
        username: user.username,
        email: user.email,
        roles: user.roles,
        HoneyCombId: user.HoneyCombId,
        lastActive: new Date(user.lastActive || user.createdAt).toLocaleString(),
        createdAt: user.createdAt,
        status: 'Active',
        
      }));
      console.log(`Loaded ${this.users.length} users:`, this.users);
    });
  }

  filteredUsers(): User[] {
    if (!this.searchText.trim()) {
      console.log(`Returning all ${this.users.length} users`);
      return this.users;
    }

    const lowerSearch = this.searchText.trim().toLowerCase();

    const filtered = this.users.filter(user =>
      user.username.toLowerCase().includes(lowerSearch) ||
      user.email.toLowerCase().includes(lowerSearch) ||
      user.roles.toLowerCase().includes(lowerSearch)
    );
    
    console.log(`Filtered ${filtered.length} users from ${this.users.length} total`);
    return filtered;
  }

  toggleDropdown(user: User): void {
    this.users.forEach(u => {
      if (u !== user) u.showMenu = false;
    });
    user.showMenu = !user.showMenu;
  }
  
  deleteUser(user: User): void {
    if (confirm(`Are you sure you want to delete ${user.username}?`)) {
      this.userService.deleteUser(user.username).subscribe(
        () => {
          this.users = this.users.filter(u => u.username !== user.username);
        },
        (error) => {
          console.error('Error deleting user:', error);
          alert('Failed to delete user. Please try again.');
        }
      );
    }
  }

  addUser(): void {
    // Prompt for new admin details
    const username = prompt("Enter new admin's username:");
    if (!username) return;
    
    const email = prompt("Enter new admin's email:");
    if (!email) return;
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    const honeycombId = prompt("Enter new admin's Honeycomb ID:");
    if (!honeycombId) return;

    const password = prompt("Enter new admin's password:");
    if (!password) return;
    
    const now = new Date().toISOString();
    
    // Create new admin user with Admin role
    const newUser: UserCreate = {
      username: username,
      email: email,
      password: password,
      HoneyCombId: honeycombId,
      roles: 'Admin', // Always setting role to Admin
      status: 'Active',
      createdAt: now,
      lastActive: now
    };
    
    // Send request to add the user
    this.userService.addUser(newUser).subscribe({
      next: (createdUser) => {
        // Add the new user to the list with proper formatting
        const formattedUser: User = {
          username: createdUser.username,
          email: createdUser.email,
          roles: createdUser.roles,
          HoneyCombId: createdUser.HoneyCombId,
          lastActive: new Date(createdUser.lastActive || createdUser.createdAt).toLocaleString(),
          createdAt: createdUser.createdAt,
          status: 'Active'
        };
        
        this.users.push(formattedUser);
        alert(`Admin user '${username}' added successfully!`);
      },
      error: (err) => {
        console.error('Failed to add admin user:', err);
        if (err.status === 400) {
          alert('User with this email already exists or invalid data provided.');
        } else {
          alert('Failed to add user. Please try again.');
        }
      }
    });
  }
}













