import { HeaderComponent } from "../header/header.component";
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Chart, ChartConfiguration } from 'chart.js';
import { CouriersidebarComponent } from "../sidebar/couriersidebar/couriersidebar.component";
import { FooterComponent } from "../../footer/footer.component";



@Component({
  standalone:true,
  selector: 'app-courier',
  templateUrl: './courier-dashboard.component.html',
  styleUrls: ['./courier-dashboard.component.css'],
  imports: [HeaderComponent, CouriersidebarComponent, FooterComponent]
})
export class CourierDashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('deliveryPieChart') deliveryPieChartRef!: ElementRef;

  // Delivery stats
  deliveryStats = {
    total: 650,
    pending: 430,
    completed: 200,
    rejected: 20
  };

  // Recent deliveries data
  recentDeliveries = [
    {
      id: '00001A',
      orderId: '202400085',
      orderDate: '19/12/2024',
      estimatedDate: '26/12/2024',
      city: 'Galle',
      status: 'Completed'
    },
    {
      id: '00002B',
      orderId: '202400025',
      orderDate: '19/12/2024',
      estimatedDate: '26/12/2024',
      city: 'Colombo',
      status: 'Pending'
    },
    {
      id: '00003C',
      orderId: '202400093',
      orderDate: '20/12/2024',
      estimatedDate: '27/12/2024',
      city: 'Kaluthara',
      status: 'Completed'
    },
    {
      id: '00004D',
      orderId: '202400069',
      orderDate: '21/12/2024',
      estimatedDate: '28/12/2024',
      city: 'Mathara',
      status: 'Completed'
    },
    {
      id: '00005E',
      orderId: '202400048',
      orderDate: '22/12/2024',
      estimatedDate: '31/12/2024',
      city: 'Galle',
      status: 'rejected'
    },
    {
      id: '00005E',
      orderId: '202400048',
      orderDate: '22/12/2024',
      estimatedDate: '31/12/2024',
      city: 'Galle',
      status: 'Completed'
    }
  ];

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initializePieChart();
  }

  initializePieChart(): void {
    const canvas = this.deliveryPieChartRef.nativeElement;
    const ctx = canvas.getContext('2d');

    const config: ChartConfiguration = {
      type: 'pie',
      data: {
        labels: ['Pending Deliveries', 'Completed Deliveries', 'Rejected Deliveries'],
        datasets: [{
          data: [this.deliveryStats.pending, this.deliveryStats.completed, this.deliveryStats.rejected],
          backgroundColor: [
            '#f9e559', // Yellow for pending
            '#4caf50', // Green for completed
            '#f44336'  // Red for rejected
          ],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.formattedValue;
                const dataset = context.dataset;
                const total = dataset.data.reduce((a: any, b: any) => a + b, 0);
                const percentage = Math.round((context.raw as number / total) * 100);
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    };

    new Chart(ctx, config);
  }

  printReport(): void {
    window.print();
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'completed';
      case 'pending':
        return 'pending';
      case 'rejected':
        return 'rejected';
      default:
        return '';
    }
  }
}
