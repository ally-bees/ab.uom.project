import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

interface ChatMessage {
  id?: string;
  text: string;
  sender: string;
  receiver: string;
  timestamp: Date;
  isCompleted?: boolean;
}

@Injectable({
  providedIn: 'root'
})

export class ChatService {

  private apiUrl = 'http://localhost:5241/api/chat';

  constructor(private http: HttpClient) {}

  sendMessage(message: ChatMessage): Observable<any> {
    return this.http.post(`${this.apiUrl}/send`, message);
  }

  getMessagesBetween(sender: string, receiver: string): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(`${this.apiUrl}/messages?sender=${sender}&receiver=${receiver}`);
  }
  
}

