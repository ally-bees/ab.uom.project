
import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../pages/header/header.component';
import { SidebarComponent } from '../../pages/sidebar/sidebar.component';
import { FooterComponent } from "../../footer/footer.component";

@Component({
  selector: 'app-system-config',
  standalone:true,
  imports: [HeaderComponent, SidebarComponent, FooterComponent],
  templateUrl: './system-config.component.html',
  styleUrls: ['./system-config.component.css']
})
export class SystemConfigComponent implements OnInit {
  apiKey: string = '••••••••••••••';
  twoFactorEnabled: boolean = true;
  
  constructor() { }

  ngOnInit(): void {
  }

  regenerateApiKey(): void {
    // Implement API key regeneration
    console.log('Regenerate API key clicked');
  }

  toggleTwoFactor(): void {
    this.twoFactorEnabled = !this.twoFactorEnabled;
  }
}