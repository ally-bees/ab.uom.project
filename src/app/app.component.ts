import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardComponent } from './adminpart/dashboard/dashboard.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,DashboardComponent],
  template: `<router-outlet></router-outlet>`,
  styles: []
})
export class AppComponent {
  title = 'dashboard-app';
}