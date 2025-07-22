import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastNotificationsComponent } from './shared/toast-notifications/toast-notifications.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastNotificationsComponent],
  template: `
    <router-outlet></router-outlet>
    <app-toast-notifications></app-toast-notifications>
  `,
  styles: []
})
export class AppComponent {
  title = 'dashboard-app';
}
