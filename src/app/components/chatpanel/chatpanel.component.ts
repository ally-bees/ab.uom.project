import { Component, OnDestroy, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { ChatService } from './chatpanel.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 

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
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './chatpanel.component.html',
  styleUrls: ['./chatpanel.component.css']
})
export class ChatpanelComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messagesContainer', { static: false }) messagesContainer!: ElementRef;
  
  currentMessage = '';
  messages: ChatMessage[] = [];
  private msgSub!: Subscription;
  private shouldScrollToBottom = false;

  sender = 'BusinessOwner';
  receiver = 'SalesManager';
  receivers = [
    { name: 'BusinessOwner', image: 'assets/images/bo.jpg' },
    { name: 'SalesManager',  image: 'assets/images/sm.jpg' },
    { name: 'InventoryManager', image: 'assets/images/im.jpg' },
    { name: 'MarketingHead', image: 'assets/images/mm.jpg' },
    { name: 'FinanceManager', image: 'assets/images/fm.jpg' }
  ];

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.loadMessages();
    this.chatService.startHubConnection(this.sender);

    this.msgSub = this.chatService.message$.subscribe(msg => {
      if (msg && this.isRelevantMessage(msg)) {
        // Only add if it's not from the current user (to avoid duplicates from own sends)
        if (msg.sender !== this.sender) {
          this.messages.push(msg);
          this.sortMessages();
          this.shouldScrollToBottom = true;
        }
      }
    });
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  ngOnDestroy(): void {
    this.msgSub?.unsubscribe();
    this.chatService.stopHubConnection();
  }

  loadMessages(): void {
    this.chatService.getMessagesBetween(this.sender, this.receiver).subscribe(msgs => {
      this.messages = msgs.sort((a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
      this.shouldScrollToBottom = true;
    });
  }

  private sortMessages(): void {
    this.messages.sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }

  sendMessage(): void {
    if (!this.currentMessage.trim()) return;

    const newMsg: ChatMessage = {
      text: this.currentMessage,
      sender: this.sender,
      receiver: this.receiver,
      timestamp: new Date()
    };

    // Add message immediately to UI for instant feedback
    this.messages.push(newMsg);
    this.sortMessages();
    this.shouldScrollToBottom = true;
    this.currentMessage = '';

    // Send to backend (this will save to DB and broadcast via SignalR)
    this.chatService.sendMessage(newMsg).subscribe({
      next: (response) => {
        console.log('Message sent successfully');
      },
      error: err => {
        console.error('HTTP send error', err);
        // Remove the message from UI if sending failed
        this.messages = this.messages.filter(m => m !== newMsg);
      }
    });
  }

  setReceiver(newReceiver: string): void {
    if (this.receiver !== newReceiver) {
      this.receiver = newReceiver;
      this.loadMessages();
    }
  }

  //to scroll to new messages
  private scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        const element = this.messagesContainer.nativeElement;
        element.scrollTop = element.scrollHeight;
      }
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }

  getPersonImage(senderName: string): string {
    const p = this.receivers.find(x => x.name === senderName);
    return p ? p.image : 'assets/default-avatar.png';
  }

  private isRelevantMessage(msg: ChatMessage): boolean {
    return (msg.sender === this.sender && msg.receiver === this.receiver) ||
           (msg.sender === this.receiver && msg.receiver === this.sender);
  }
}