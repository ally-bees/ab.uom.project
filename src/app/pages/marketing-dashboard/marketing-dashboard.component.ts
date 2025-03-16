import { Component, OnInit } from '@angular/core';

interface CampaignStat {
  title: string;
  value: string | number;
  icon: string;
  color: string;
}

interface Member {
  name: string;
  accessLevel: string;
  avatar: string;
}

@Component({
  selector: 'app-marketing-dashboard',
  templateUrl: './marketing-dashboard.component.html',
  styleUrls: ['./marketing-dashboard.component.css']
})
export class MarketingDashboardComponent implements OnInit {
  campaignStats: CampaignStat[] = [
    { title: 'Campaigns', value: 10, icon: 'campaign', color: 'linear-gradient(135deg, #3f5efb, #00BFFF)' },
    { title: 'Spent Amount', value: '100.000', icon: 'money', color: '#E3F2FD' },
    { title: 'New Visitors', value: 6, icon: 'person_add', color: '#E3F2FD' },
    { title: 'New Customers', value: 4, icon: 'groups', color: '#E3F2FD' }
  ];

  members: Member[] = [
    { name: 'Jaquline', accessLevel: 'Full Access', avatar: 'assets/avatar1.jpg' },
    { name: 'Sennorita', accessLevel: 'Limited Access', avatar: 'assets/avatar2.jpg' },
    { name: 'Firoz', accessLevel: 'Full Access', avatar: 'assets/avatar3.jpg' }
  ];

  campaignResults = [

    { label: 'Total Order', value: 81, color: '#FF6B6B' },
    { label: 'Customer Growth', value: 22, color: '#1DE9B6' },
    { label: 'Total Revenue', value: 62, color: '#4285F4' }
  ];

  showValue = true;
  showChart = true;

  constructor() { }

  ngOnInit(): void { }
}
