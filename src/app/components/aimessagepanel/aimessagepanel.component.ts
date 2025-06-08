import { Component,OnInit,ViewChild,ElementRef,AfterViewChecked} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChatService } from './aimessagepanel.service';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isUser?: boolean;
  isCompleted?: boolean;
}

@Component({
  selector: 'app-aimessagepanel',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './aimessagepanel.component.html',
  styleUrl: './aimessagepanel.component.css'
})
export class AimessagepanelComponent implements OnInit, AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  messages: Message[] = [];
  currentMessage = '';
  isLoading = false;
  isStreaming = false;
  useStreaming = true;
  isConnected = true;

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.checkBackendHealth();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  checkBackendHealth() {
    this.chatService.checkHealth().subscribe({
      next: () => {
        this.isConnected = true;
      },
      error: () => {
        this.isConnected = false;
      }
    });
  }

  sendMessage() {
    if (!this.currentMessage.trim() || this.isLoading) {
      return;
    }

    const userMessage: Message = {
      role: 'user',
      content: this.currentMessage,
      timestamp: new Date(),
      isUser: true,
      isCompleted: true
    };

    this.messages.push(userMessage);
    const messageToSend = this.currentMessage;
    this.currentMessage = '';
    this.isLoading = true;

    const assistantMessage: Message = {
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isUser: false,
      isCompleted: false
    };
    this.messages.push(assistantMessage);

    const history = this.messages.slice(0, -1).map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    if (this.useStreaming) {
      this.sendStreamingMessage(messageToSend, history, assistantMessage);
    } else {
      this.sendRegularMessage(messageToSend, history, assistantMessage);
    }
  }

  private sendStreamingMessage(message: string, history: any[], assistantMessage: Message) {
    this.isStreaming = true;

    this.chatService.sendMessageStream(message, history).subscribe({
      next: (response) => {
        assistantMessage.content = response;
      },
      error: () => {
        assistantMessage.content = 'Sorry, there was an error processing your request.';
        this.isLoading = false;
        this.isStreaming = false;
        assistantMessage.isCompleted = true;
      },
      complete: () => {
        this.isLoading = false;
        this.isStreaming = false;
        assistantMessage.isCompleted = true;
      }
    });
  }

  private sendRegularMessage(message: string, history: any[], assistantMessage: Message) {
    this.chatService.sendMessage(message, history).subscribe({
      next: (response) => {
        assistantMessage.content = response?.response ?? 'Sorry, there was no response.';
        assistantMessage.isCompleted = true;
        this.isLoading = false;
      },
      error: () => {
        assistantMessage.content = 'Sorry, there was an error processing your request.';
        assistantMessage.isCompleted = true;
        this.isLoading = false;
      }
    });
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  toggleStreaming() {
    this.useStreaming = !this.useStreaming;
  }

  clearChat() {
    this.messages = [];
  }

  private scrollToBottom(): void {
    if (this.messagesContainer) {
      const element = this.messagesContainer.nativeElement;
      element.scrollTop = element.scrollHeight;
    }
  }

  trackByIndex(index: number): number {
    return index;
  }
}
