import { Component ,OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsCardComponent } from '../../components/stats-card/stats-card.component';
import { TopSellingComponent } from '../../components/top-selling/top-selling.component';
import { SalesHeatmapComponent } from '../../components/sales-heatmap/sales-heatmap.component';

@Component({
  selector: 'app-sales-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    StatsCardComponent,
    TopSellingComponent,
    SalesHeatmapComponent,
  ],
  templateUrl: './sales-dashboard.component.html',
  styleUrls: ['./sales-dashboard.component.css']
})

export class SalesDashboardComponent {
 
}
