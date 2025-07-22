import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { HeaderComponent } from '../../pages/header/header.component';
import { FooterComponent } from '../../footer/footer.component';
import { BOSidebarComponent } from '../../pages/sidebar/BusinesOwnerSidebar/sidebar.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-business-mainpage',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, RouterModule, BOSidebarComponent,MatIconModule],
  templateUrl: './bussiness-mainpage.component.html',
  styleUrl: './bussiness-mainpage.component.css'
})
export class BusinessMainpageComponent {

}
