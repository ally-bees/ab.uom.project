import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { HeaderComponent } from '../../pages/header/header.component';
import { FooterComponent } from '../../footer/footer.component';
import { inventorySidebarComponent } from '../../pages/sidebar/inventory-sidebar/inventory-sidebar.component';

@Component({
  selector: 'app-inventory-mainpage',
  standalone: true,
  imports: [ RouterModule, HeaderComponent, inventorySidebarComponent, FooterComponent],
  templateUrl: './inventory-mainpage.component.html',
  styleUrl: './inventory-mainpage.component.css'
})
export class InventoryMainpageComponent {

}
