import { Component, OnDestroy, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { ChatService } from './chatpanel.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AuthService } from '../../services/auth.service'; // adjust path if needed

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

@Component({
  selector: 'app-chatpanel',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './chatpanel.component.html',
  styleUrls: ['./chatpanel.component.css'],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)', opacity: 0 }),
        animate('300ms ease-in', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ transform: 'translateY(-100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class ChatpanelComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messagesContainer', { static: false }) messagesContainer!: ElementRef;

  currentMessage = '';
  messages: ChatMessage[] = [];
  private msgEventSub!: Subscription;
  private shouldScrollToBottom = false;
  editMode: boolean = false;
  editingMessageId: string | null = null;

  // Popup properties
  showPopup: boolean = false;
  popupMessage: string = '';
  popupType: 'success' | 'error' = 'success';
  private popupTimeout: any;

  sender = 'SalesManager';
  receiver = 'SalesManager';
  allReceivers = [
    { name: 'SalesManager', image: 'assets/images/sm.jpg' },
    { name: 'BusinessOwner', image: 'assets/images/bo.jpg' },
    { name: 'InventoryManager', image: 'assets/images/im.jpg' },
    { name: 'MarketingHead', image: 'assets/images/mm.jpg' }
  ];

  receivers: { name: string, image: string }[] = [];


  constructor(
    private chatService: ChatService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user && user.Role) {
      this.sender = this.mapRoleToSender(user.Role);
    } else {
      this.sender = 'UnknownUser';
    }

    // Pick default receiver (first one that is not sender)
    const defaultReceiver = this.allReceivers.find(r => r.name !== this.sender)?.name || '';

    this.receiver = defaultReceiver;
    this.updateReceivers(this.receiver); // setup receiver list
    this.loadMessages();
    this.chatService.startHubConnection(this.sender);


    this.msgEventSub = this.chatService.messageEvent$.subscribe(event => {
      if (event && this.isRelevantMessage(event.message)) {
        this.handleMessageEvent(event);
      }
    });
  }

  private mapRoleToSender(role: string): string {
    const map: { [key: string]: string } = {
      'Sales Manager': 'SalesManager',
      'Business Owner': 'BusinessOwner',
      'Inventory Manager': 'InventoryManager',
      'Marketing Manager': 'MarketingHead'
    };
    return map[role] || role.replace(/\s/g, '');
  }



  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  ngOnDestroy(): void {
    this.msgEventSub?.unsubscribe();
    this.chatService.stopHubConnection();
    if (this.popupTimeout) {
      clearTimeout(this.popupTimeout);
    }
  }

  loadMessages(): void {
    this.chatService.getMessagesBetween(this.sender, this.receiver).subscribe(msgs => {
      this.messages = msgs.sort((a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
      this.shouldScrollToBottom = true;
    });
  }

  private handleMessageEvent(event: MessageEvent): void {
    switch (event.type) {
      case 'send':
        // Only add if it's not from the current user (to avoid duplicates from own sends)
        if (event.message.sender !== this.sender) {
          this.messages.push(event.message);
          this.sortMessages();
          this.shouldScrollToBottom = true;
        }
        break;

      case 'edit':
        const editIndex = this.messages.findIndex(m => m.id === event.message.id);
        if (editIndex !== -1) {
          this.messages[editIndex] = { ...event.message, isEdited: true };
        }
        break;

      case 'delete':
        this.messages = this.messages.filter(m => m.id !== event.message.id);
        break;
    }
  }

  private sortMessages(): void {
    this.messages.sort((a, b) =>
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }

  sendMessage(): void {
    if (!this.currentMessage.trim()) return;

    if (this.editMode && this.editingMessageId) {
      // Edit existing message
      this.chatService.updateMessage(this.editingMessageId, this.currentMessage).subscribe({
        next: () => {
          const msg = this.messages.find(m => m.id === this.editingMessageId);
          if (msg) {
            msg.text = this.currentMessage;
            msg.isEdited = true;
          }

          this.showSuccessPopup('Message updated successfully!');
          this.resetEditMode();
        },
        error: err => {
          console.error('Edit failed', err);
          this.showErrorPopup('Failed to update message. Please try again.');
        }
      });

      return; // ✅ important to exit after editing
    }

    // === SEND NEW MESSAGE LOGIC ===
    const newMsg: ChatMessage = {
      text: this.currentMessage,
      sender: this.sender,
      receiver: this.receiver,
      timestamp: new Date()
    };

    this.messages.push(newMsg);
    this.sortMessages();
    this.shouldScrollToBottom = true;
    this.currentMessage = '';

    this.chatService.sendMessage(newMsg).subscribe({
      next: (response) => {
        console.log('Message sent successfully');
      },
      error: err => {
        console.error('HTTP send error', err);
        this.messages = this.messages.filter(m => m !== newMsg);
        this.showErrorPopup('Failed to send message. Please try again.');
      }
    });
  }




  setReceiver(newReceiver: string): void {
  if (this.receiver !== newReceiver) {
    this.receiver = newReceiver;
    this.updateReceivers(newReceiver); // refresh the UI list
    this.resetEditMode();
    this.loadMessages();
  }
}


  private updateReceivers(highlightReceiver: string): void {
  this.receivers = this.allReceivers
    .filter(r => r.name !== this.sender) // remove sender
    .sort((a, b) =>
      a.name === highlightReceiver ? -1 :
      b.name === highlightReceiver ? 1 : 0
    );
}



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

  onDeleteMessage(message: ChatMessage): void {
    this.chatService.deleteMessage(message.id!).subscribe({
      next: () => {
        // Remove the deleted message from the local array immediately for instant feedback
        this.messages = this.messages.filter(m => m.id !== message.id);
        this.showSuccessPopup('Message deleted successfully!');
      },
      error: (err) => {
        console.error('Delete failed', err);
        this.showErrorPopup('Failed to delete message. Please try again.');
      }
    });
  }

  onEditMessage(message: ChatMessage): void {
    this.editMode = true;
    this.editingMessageId = message.id!;
    this.currentMessage = message.text;
  }

  cancelEdit(): void {
    this.resetEditMode();
  }

  private resetEditMode(): void {
    this.editMode = false;
    this.editingMessageId = null;
    this.currentMessage = '';
  }

  private showSuccessPopup(message: string): void {
    this.showPopup = true;
    this.popupMessage = message;
    this.popupType = 'success';
    this.autoHidePopup();
  }

  private showErrorPopup(message: string): void {
    this.showPopup = true;
    this.popupMessage = message;
    this.popupType = 'error';
    this.autoHidePopup();
  }

  private autoHidePopup(): void {
    if (this.popupTimeout) {
      clearTimeout(this.popupTimeout);
    }

    this.popupTimeout = setTimeout(() => {
      this.showPopup = false;
    }, 1000); // Hide after 3 seconds
  }
}