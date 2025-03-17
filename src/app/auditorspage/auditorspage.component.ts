import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { HeaderComponent } from '../pages/header/header.component';
import { SidebarComponent } from '../pages/sidebar/sidebar.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-auditorspage',
  standalone: true,
  imports: [RouterModule,HeaderComponent,SidebarComponent, FooterComponent],
  templateUrl: './auditorspage.component.html',
  styleUrl: './auditorspage.component.css'
})
export class AuditorspageComponent {

}
