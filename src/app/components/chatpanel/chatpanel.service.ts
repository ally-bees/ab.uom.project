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
  isEdited?: boolean;
}

interface MessageEvent {
  type: 'send' | 'edit' | 'delete';
  message: ChatMessage;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private apiUrl = 'http://localhost:5241/api/chat';
  private hubConnection!: signalR.HubConnection;

  // Use a subject so components can subscribe to message events
  private messageEventSubject = new BehaviorSubject<MessageEvent | null>(null);
  public messageEvent$ = this.messageEventSubject.asObservable();

  constructor(private http: HttpClient) {}

  sendMessage(message: ChatMessage): Observable<any> {
    return this.http.post(`${this.apiUrl}/send`, message);
  }

  getMessagesBetween(sender: string, receiver: string): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(`${this.apiUrl}/messages?sender=${sender}&receiver=${receiver}`);
  }

  deleteMessage(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }

  updateMessage(id: string, newText: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/edit/${id}`, { text: newText });
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
      .catch((err: any) => console.error('SignalR connection error:', err));

    // Register to receive new messages
    this.hubConnection.on('ReceiveMessage', (msg: ChatMessage) => {
      console.log('Received new message via SignalR:', msg);
      
      if (typeof msg.timestamp === 'string') {
        msg.timestamp = new Date(msg.timestamp);
      }
      
      this.messageEventSubject.next({ type: 'send', message: msg });
    });

    // Register to receive message updates
    this.hubConnection.on('MessageUpdated', (msg: ChatMessage) => {
      console.log('Received message update via SignalR:', msg);
      
      if (typeof msg.timestamp === 'string') {
        msg.timestamp = new Date(msg.timestamp);
      }
      
      // Mark the message as edited when received via SignalR
      msg.isEdited = true;
      
      this.messageEventSubject.next({ type: 'edit', message: msg });
    });

    // Register to receive message deletions
    this.hubConnection.on('MessageDeleted', (msg: ChatMessage) => {
      console.log('Received message deletion via SignalR:', msg);
      
      this.messageEventSubject.next({ type: 'delete', message: msg });
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