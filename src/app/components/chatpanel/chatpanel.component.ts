import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule,NgIf, NgFor, NgClass } from '@angular/common';
import { ChatService } from './chatpanel.service'


interface ChatMessage {
  id?: string;
  text: string;
  sender: string;
  receiver: string;
  timestamp: Date;
  isCompleted?: boolean;
}

@Component({
  selector: 'app-chatpanel',
  standalone: true,
  imports: [FormsModule,CommonModule,NgIf, NgFor, NgClass],
  templateUrl: './chatpanel.component.html',
  styleUrl: './chatpanel.component.css'
})

export class ChatpanelComponent {
  currentMessage: string = '';
  messages: ChatMessage[] = [];

  // current user context
  sender: string = 'BusinessOwner';
  receiver: string = 'SalesManager';
  receivers = [
    { name: 'BusinessOwner', image: 'assets/images/bo.jpg' },
  { name: 'SalesManager', image: 'assets/images/sm.jpg' },
  { name: 'InventoryManager', image: 'assets/images/im.jpg' },
  { name: 'MarketingHead', image: 'assets/images/mm.jpg' },
  { name: 'FinanceManager', image: 'assets/images/fm.jpg' }
];

getPersonImage(senderName: string): string {
  const person = this.receivers.find(p => p.name === senderName);
  return person ? person.image : 'assets/default-avatar.png';
}

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
