import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification } from '../../services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notification-container">
      @for (notification of notifications; track notification) {
        <div class="notification" [class]="getNotificationClass(notification)" role="alert">
          <div class="notification-content">
            {{ notification.message }}
          </div>
          <button type="button" class="btn-close" 
                  (click)="removeNotification(notification)"
                  aria-label="Close">
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .notification-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1050;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 350px;
    }

    .notification {
      padding: 15px;
      border-radius: 4px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 10px;
      animation: slideIn 0.3s ease-out;
    }

    .notification-content {
      flex: 1;
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    .success {
      background-color: #d4edda;
      border-color: #c3e6cb;
      color: #155724;
    }

    .error {
      background-color: #f8d7da;
      border-color: #f5c6cb;
      color: #721c24;
    }

    .warning {
      background-color: #fff3cd;
      border-color: #ffeeba;
      color: #856404;
    }

    .info {
      background-color: #cce5ff;
      border-color: #b8daff;
      color: #004085;
    }
  `]
})
export class NotificationComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  private subscription?: Subscription;

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.subscription = this.notificationService.notifications$.subscribe(
      notification => {
        this.addNotification(notification);
      }
    );
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  private addNotification(notification: Notification) {
    this.notifications.push(notification);

    // Auto remove after duration
    if (notification.duration !== undefined) {
      setTimeout(() => {
        this.removeNotification(notification);
      }, notification.duration);
    }
  }

  removeNotification(notification: Notification) {
    const index = this.notifications.indexOf(notification);
    if (index > -1) {
      this.notifications.splice(index, 1);
    }
  }

  getNotificationClass(notification: Notification): string {
    return `notification ${notification.type}`;
  }
}