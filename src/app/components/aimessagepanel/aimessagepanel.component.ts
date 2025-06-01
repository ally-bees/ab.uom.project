import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface ChatMessage {
  id: number;
  text: string;
  isUser: boolean;
  isCompleted?: boolean;
}


@Component({
  selector: 'app-aimessagepanel',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './aimessagepanel.component.html',
  styleUrl: './aimessagepanel.component.css'
})
export class AimessagepanelComponent {
  currentMessage: string = '';
  
  messages: ChatMessage[] = [];

  sendMessage() {
    if (this.currentMessage.trim()) {
      const newMessage: ChatMessage = {
        id: this.messages.length + 1,
        text: this.currentMessage,
        isUser: true
      };
      
      this.messages.push(newMessage);
      this.currentMessage = '';
      
      // Simulate bot response after a delay
      setTimeout(() => {
        const botResponse: ChatMessage = {
          id: this.messages.length + 1,
          text: 'I understand your concern. Let me help you with that.',
          isUser: false,
          isCompleted: true
        };
        this.messages.push(botResponse);
      }, 1000);
    }
  }
}
