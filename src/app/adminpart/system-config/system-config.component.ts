
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-system-config',
  standalone:true,
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