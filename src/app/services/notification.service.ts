import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  showCloseButton?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  constructor() {}

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private addNotification(notification: Notification): void {
    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([...currentNotifications, notification]);

    // Auto remove after duration
    if (notification.duration && notification.duration > 0) {
      setTimeout(() => {
        this.removeNotification(notification.id);
      }, notification.duration);
    }
  }

  removeNotification(id: string): void {
    const currentNotifications = this.notificationsSubject.value;
    const filteredNotifications = currentNotifications.filter(n => n.id !== id);
    this.notificationsSubject.next(filteredNotifications);
  }

  clearAll(): void {
    this.notificationsSubject.next([]);
  }

  // Success notification
  showSuccess(title: string, message?: string, duration: number = 5000): void {
    const notification: Notification = {
      id: this.generateId(),
      type: 'success',
      title,
      message,
      duration,
      showCloseButton: true
    };
    this.addNotification(notification);
  }

  // Error notification
  showError(title: string, message?: string, duration: number = 7000): void {
    const notification: Notification = {
      id: this.generateId(),
      type: 'error',
      title,
      message,
      duration,
      showCloseButton: true
    };
    this.addNotification(notification);
  }

  // Warning notification
  showWarning(title: string, message?: string, duration: number = 6000): void {
    const notification: Notification = {
      id: this.generateId(),
      type: 'warning',
      title,
      message,
      duration,
      showCloseButton: true
    };
    this.addNotification(notification);
  }

  // Info notification
  showInfo(title: string, message?: string, duration: number = 5000): void {
    const notification: Notification = {
      id: this.generateId(),
      type: 'info',
      title,
      message,
      duration,
      showCloseButton: true
    };
    this.addNotification(notification);
  }

  // Login success
  showLoginSuccess(username?: string): void {
    this.showSuccess(
      'Login Successful!',
      username ? `Welcome back, ${username}!` : 'You have been logged in successfully.',
      4000
    );
  }

  // Signup success
  showSignupSuccess(username?: string): void {
    this.showSuccess(
      'Account Created Successfully!',
      username ? `Welcome ${username}! Your account has been created.` : 'Your account has been created successfully.',
      5000
    );
  }

  // OTP verification success
  showOtpSuccess(): void {
    this.showSuccess(
      'Email Verified!',
      'Your email has been verified successfully.',
      4000
    );
  }
}
