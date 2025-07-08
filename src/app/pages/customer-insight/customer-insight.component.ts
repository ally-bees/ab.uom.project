import { Component ,OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FooterComponent } from '../../footer/footer.component';


@Component({
  selector: 'app-main',
  standalone: true,
  imports: [ CommonModule,RouterModule],
  templateUrl: './customer-insight.component.html',
  styleUrl: './customer-insight.component.css'
})

export class customerinsightComponent{
}
