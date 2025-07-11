import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserCreate {
  username: string;
  email: string;
  roles: string;
  password: string;
  HoneyCombId: string;
  status: string;
  createdAt: string;
  lastActive: string;
}

export interface User {
  username: string;
  email: string;
  roles: string;
  lastActive: string;
  createdAt: string;
  status?: string;
  HoneyCombId:string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:5241/api/usermanagement'; 

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  deleteUser(username: string) {
    return this.http.delete(`${this.apiUrl}/${encodeURIComponent(username)}`);
  }
  
  addUser(user: UserCreate): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  getUserCount() {
    return this.http.get<number>(`${this.apiUrl}/count`);
  }
  
  
}
