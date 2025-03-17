import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { HeaderComponent } from '../../pages/header/header.component';
import { SidebarComponent } from '../../pages/sidebar/auditorsidebar/auditorsidebar.component';
import { FooterComponent } from '../../footer/footer.component';

@Component({
  selector: 'app-auditorpage',
  standalone: true,
  imports: [ RouterModule, HeaderComponent, SidebarComponent, FooterComponent],
  templateUrl: './auditorpage.component.html',
  styleUrl: './auditorpage.component.css'
})
export class AuditorpageComponent {

}
