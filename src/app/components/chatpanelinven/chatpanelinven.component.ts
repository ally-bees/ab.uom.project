import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule,NgIf, NgFor, NgClass } from '@angular/common';
import { ChatService } from '../chatpanel/chatpanel.service'

interface ChatMessage {
  id?: string;
  text: string;
  sender: string;
  receiver: string;
  timestamp: Date;
  isCompleted?: boolean;
}


@Component({
  selector: 'app-chatpanelinven',
  standalone: true,
  imports: [FormsModule,CommonModule,NgIf, NgFor, NgClass],
  templateUrl: './chatpanelinven.component.html',
  styleUrl: './chatpanelinven.component.css'
})
export class ChatpanelinvenComponent {
  currentMessage: string = '';
    messages: ChatMessage[] = [];
  
    // current user context
    sender: string = 'InventoryManager';
    receiver: string = 'SalesManager';
  
  
    constructor(private chatService: ChatService) {}
  
    ngOnInit(): void {
      this.loadMessages();
    }
  
    loadMessages(): void {
      this.chatService.getMessagesBetween(this.sender, this.receiver).subscribe((msgs) => {
        this.messages = msgs.sort(
          (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
          });
    }
  
    sendMessage(): void {
      if (!this.currentMessage.trim()) return;
  
      const newMsg: ChatMessage = {
        text: this.currentMessage,
        sender: this.sender,
        receiver: this.receiver,
        timestamp: new Date()
      };
  
      this.chatService.sendMessage(newMsg).subscribe(() => {
        this.currentMessage = '';
        this.loadMessages();
      });
    }
  
    setReceiver(newReceiver: string): void {
    if (this.receiver !== newReceiver) {
      this.receiver = newReceiver;
      this.loadMessages();
    }
  }
  
}
