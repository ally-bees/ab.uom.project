import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';

interface Invoice {
  id: string;
  date: Date;
  orderDate: Date;
  shipmentDate: Date;
  city: string;
  status: string;
}

@Component({
  selector: 'app-finance',
  standalone: true,
  imports: [ FormsModule, CommonModule ],
  templateUrl: './finance.component.html',
  styleUrls: ['./finance.component.scss']
})
export class FinanceComponent implements OnInit, AfterViewInit {
  @ViewChild('pieChartContainer') pieChartContainer!: ElementRef;

  // Date filters
  fromDate: string | undefined;
  toDate: string | undefined;
  searchTerm: string = '';
  
  // Financial data
  totalProfit: number = 500000;
  totalRevenue: number = 700000;
  totalExpenses: number = 200000;
  onHoldAmount: number = 50000;
  
  // Dummy data for invoices
  invoices: Invoice[] = [
    {
      id: 'INV001',
      date: new Date('2024-03-15'),
      orderDate: new Date('2024-03-12'),
      shipmentDate: new Date('2024-03-20'),
      city: 'Mumbai',
      status: 'New'
    },
    {
      id: 'INV002',
      date: new Date('2024-04-25'),
      orderDate: new Date('2024-04-20'),
      shipmentDate: new Date('2024-05-01'),
      city: 'Chennai',
      status: 'Pending'
    },
    {
      id: 'INV003',
      date: new Date('2024-05-08'),
      orderDate: new Date('2024-05-03'),
      shipmentDate: new Date('2024-05-12'),
      city: 'Bangalore',
      status: 'Completed'
    },
    {
      id: 'INV004',
      date: new Date('2024-06-10'),
      orderDate: new Date('2024-06-05'),
      shipmentDate: new Date('2024-06-15'),
      city: 'Kolkata',
      status: 'Completed'
    },
    {
      id: 'INV005',
      date: new Date('2024-06-18'),
      orderDate: new Date('2024-06-12'),
      shipmentDate: new Date('2024-06-22'),
      city: 'Delhi',
      status: 'Cancelled'
    },
    {
      id: 'INV006',
      date: new Date('2024-07-05'),
      orderDate: new Date('2024-07-01'),
      shipmentDate: new Date('2024-07-10'),
      city: 'Hyderabad',
      status: 'Completed'
    }
  ];
filteredInvoices: any;

  constructor() { }

  ngOnInit(): void {
    // Initialize date filters
    const today = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(today.getMonth() - 3);
    
    this.fromDate = this.formatDate(threeMonthsAgo);
    this.toDate = this.formatDate(today);
    
    // Load initial data
    this.loadFinanceData();
  }

  ngAfterViewInit(): void {
    // Initialize charts after view is ready
    setTimeout(() => {
      this.initializePieChart();
    }, 100);
  }

  loadFinanceData(): void {
    // Here you would fetch data from your services
    // Example:
    // this.dataService.getFinancialSummary(this.fromDate, this.toDate).subscribe(data => {
    //   this.totalProfit = data.totalProfit;
    //   this.totalRevenue = data.totalRevenue;
    //   this.totalExpenses = data.totalExpenses;
    //   this.onHoldAmount = data.onHoldAmount;
    //   this.renderPieChart();
    // });
    
    // this.dataService.getInvoices(this.fromDate, this.toDate).subscribe(data => {
    //   this.invoices = data;
    // });
  }

  initializePieChart(): void {
    // Initialize your pie chart here using chart library of your choice
    // Example placeholder - replace with your actual chart implementation:
    console.log('Rendering pie chart in', this.pieChartContainer.nativeElement);
    
    // Example with chart.js or any other library:
    // const ctx = this.pieChartContainer.nativeElement;
    // const data = {
    //   datasets: [{
    //     data: [this.onHoldAmount, this.totalProfit, this.totalExpenses],
    //     backgroundColor: ['#fbbc05', '#ea4335', '#34a853']
    //   }],
    //   labels: ['On Hold Amount', 'Net Income', 'Total Expenses']
    // };
    // const chart = new Chart(ctx, {
    //   type: 'pie',
    //   data: data,
    //   options: {...}
    // });
  }

  printReport(): void {
    // Implement report printing functionality
    console.log('Printing finance report...');
    window.print();
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}