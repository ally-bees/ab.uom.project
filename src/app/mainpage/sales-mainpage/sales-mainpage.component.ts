import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { HeaderComponent } from '../../pages/header/header.component';
import { FooterComponent } from '../../footer/footer.component';
import { SMSidebarComponent } from '../../pages/sidebar/sales-sidebar/sales-sidebar.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sales-mainpage',
  standalone: true,
  imports: [ 
    RouterModule, 
    HeaderComponent, 
    SMSidebarComponent, 
    FooterComponent,
    MatIconModule
  ],
  templateUrl: './sales-mainpage.component.html',
  styleUrl: './sales-mainpage.component.css'
})
export class SalesMainpageComponent {

}
