import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import * as signalR from '@microsoft/signalr';

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
  private hubConnection!: signalR.HubConnection;

  // Use a subject so components can subscribe to new messages
  private messageSubject = new BehaviorSubject<ChatMessage | null>(null);
  public message$ = this.messageSubject.asObservable();

  constructor(private http: HttpClient) {}

  sendMessage(message: ChatMessage): Observable<any> {
    return this.http.post(`${this.apiUrl}/send`, message);
  }

  getMessagesBetween(sender: string, receiver: string): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(`${this.apiUrl}/messages?sender=${sender}&receiver=${receiver}`);
  }
  
  public startHubConnection(sender: string): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5241/chathub', {
        withCredentials: true 
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => {
        console.log('SignalR: connected to chat hub');
      })
      .catch(err => console.error('SignalR connection error:', err));

    // Register to receive messages
    this.hubConnection.on('ReceiveMessage', (msg: ChatMessage) => {
      console.log('Received message via SignalR:', msg);
      
      // Convert timestamp string to Date object if needed
      if (typeof msg.timestamp === 'string') {
        msg.timestamp = new Date(msg.timestamp);
      }
      
      // Push all messages - component will filter
      this.messageSubject.next(msg);
    });
  }

  public stopHubConnection(): void {
    if (this.hubConnection) {
      this.hubConnection.stop();
    }
  }

  public sendViaHub(msg: ChatMessage): void {
    if (this.hubConnection && this.hubConnection.state === signalR.HubConnectionState.Connected) {
      this.hubConnection.invoke('SendMessage', msg.sender, msg.receiver, msg.text)
        .catch(err => console.error('SignalR invoke error:', err));
    }
  }
}