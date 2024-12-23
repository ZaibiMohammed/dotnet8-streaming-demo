import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Notification {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new Subject<Notification>();
  notifications$ = this.notificationSubject.asObservable();

  show(notification: Notification) {
    this.notificationSubject.next({
      duration: 5000, // Default duration
      ...notification
    });
  }

  success(message: string, duration?: number) {
    this.show({ type: 'success', message, duration });
  }

  error(message: string, duration?: number) {
    this.show({ type: 'error', message, duration });
  }

  warning(message: string, duration?: number) {
    this.show({ type: 'warning', message, duration });
  }

  info(message: string, duration?: number) {
    this.show({ type: 'info', message, duration });
  }
}