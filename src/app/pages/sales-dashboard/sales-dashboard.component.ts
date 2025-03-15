import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsCardComponent } from '../../components/stats-card/stats-card.component';
import { TopSellingComponent } from '../../components/top-selling/top-selling.component';
import { SalesHeatmapComponent } from '../../components/sales-heatmap/sales-heatmap.component';
import { MembersListComponent } from '../../components/members-list/members-list.component';
import { StatsCard } from '../../models/stats.model';
import { Product } from '../../models/product.model';
import { Member } from '../../models/member.model';
import { SalesData } from '../../models/sales-data.model';
// import { NavbarComponent } from '../../navbar/navbar.component';
import { FooterComponent } from '../../footer/footer.component';

@Component({
  selector: 'app-sales-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    StatsCardComponent,
    // NavbarComponent,
    FooterComponent,
    TopSellingComponent,
    SalesHeatmapComponent,
    MembersListComponent
  ],
  templateUrl: './sales-dashboard.component.html',
  styleUrls: ['./sales-dashboard.component.css']
})
export class SalesDashboardComponent  {
  statsCards: StatsCard[] = [
    {
      count: 75,
      title: 'Total Orders',
      trend: 4.6,
      trendLabel: 'new',
      icon: 'assets/icons/sales1.png'
    },
    {
      count: 357,
      title: 'Total Delivered',
      trend: 2.5,
      trendLabel: 'today',
      icon: 'assets/icons/delivered.svg'
    }
  ];

  topSellingProducts: Product[] = [
    { name: 'iPhone', value: 100 },
    { name: 'HP Intel 7', value: 85 },
    { name: 'ChromeBook', value: 70 },
    { name: 'Mac Book', value: 65 },
    { name: 'Asus ZenBook', value: 55 },
    { name: 'Alemania', value: 45 },
    { name: 'MSI', value: 35 },
    { name: 'Acer', value: 25 }
  ];

  salesData: SalesData = {
    totalContributions: 263,
    year: '2023',
    months: {
      'Nov': [[0, 0], [1, 2], [2, 1], [3, 0]],
      'Dec': [[0, 1], [1, 3], [2, 0], [3, 0]],
      'Jan': [[0, 0], [1, 2], [2, 3], [3, 1]],
      'Feb': [[0, 2], [1, 0], [2, 1], [3, 3]],
      'Mar': [[0, 1], [1, 2], [2, 2], [3, 0]],
      'Apr': [[0, 0], [1, 1], [2, 3], [3, 2]]
    }
  };

  members: Member[] = [
    {
      name: 'Jaquiline',
      accessType: 'Full Access',
      avatar: 'assets/avatars/jaquiline.jpg'
    },
    {
      name: 'Sennorita',
      accessType: 'Limited Access',
      avatar: 'assets/avatars/sennorita.jpg'
    },
    {
      name: 'Firoz',
      accessType: 'Full Access',
      avatar: 'assets/avatars/firoz.jpg'
    }
  ];

  yearOptions = ['2021', '2022', '2023', '2024'];
  selectedYear = '2023';

  onYearChange(year: string): void {
    this.selectedYear = year;
    // In a real app, you would fetch data for the selected year
  }
}