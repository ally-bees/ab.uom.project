import { Component ,OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsCardComponent } from '../../components/stats-card/stats-card.component';
import { TopSellingComponent } from '../../components/top-selling/top-selling.component';
import { SalesHeatmapComponent } from '../../components/sales-heatmap/sales-heatmap.component';
import { SalesViewModel } from '../../models/sales-view-model.model';
import { OrdersService } from '../../services/orders.service';

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

export class SalesDashboardComponent implements OnInit {
  salesData: SalesViewModel | null = null;

  constructor(private ordersService: OrdersService) {}

  ngOnInit() {
    this.ordersService.getSalesViewModel('2025-04-01', '2025-05-01').subscribe(data => {
      this.salesData = data;
    });
  }
}
