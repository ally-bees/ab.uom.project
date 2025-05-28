import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CourierService, Courier } from '../../services/courier.service';
import { Chart } from 'chart.js';
import { HeaderComponent } from "../header/header.component";
import { CouriersidebarComponent } from "../sidebar/couriersidebar/couriersidebar.component";
import { FooterComponent } from "../../footer/footer.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-courier',
  templateUrl: './courier-dashboard.component.html',
  styleUrls: ['./courier-dashboard.component.css'],
  imports: [HeaderComponent, CouriersidebarComponent, FooterComponent, CommonModule, FormsModule]
})
export class CourierDashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('deliveryPieChart') deliveryPieChartRef!: ElementRef<HTMLCanvasElement>;

  summary: any = {};
  recentDeliveries: Courier[] = [];
  private pieChart: Chart | undefined;

  fromDate: string = '';
  toDate: string = '';

  constructor(private courierService: CourierService) {}

  ngOnInit(): void {
    this.courierService.getRecentDeliveries(6).subscribe(data => {
      this.recentDeliveries = data;
    });

   
    this.courierService.getSummary(this.fromDate, this.toDate).subscribe(data => {
      this.summary = data;
    });
  }

  ngAfterViewInit(): void {
    this.updatePieChart();
  }

  updatePieChart(): void {
    if (!this.deliveryPieChartRef) return;
    const canvas = this.deliveryPieChartRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (this.pieChart) {
      this.pieChart.destroy();
    }

    this.pieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Pending Deliveries', 'Completed Deliveries', 'Rejected Deliveries'],
        datasets: [{
          data: [
            this.summary?.pending || 0,
            this.summary?.completed || 0,
            this.summary?.rejected || 0
          ],
          backgroundColor: ['#f9e559', '#4caf50', '#f44336'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        }
      }
    });
  }

  getStatusClass(status: string | undefined): string {
    switch ((status || '').toLowerCase()) {
      case 'completed': return 'completed';
      case 'pending': return 'pending';
      case 'rejected': return 'rejected';
      default: return '';
    }
  }
}
