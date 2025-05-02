import { Component, OnInit } from '@angular/core'; 
import { HttpClient } from '@angular/common/http';
import { Sale, Order, Inventory, SalesViewModel } from '../../models/sale.model';
import { SalesService } from '../../services/sales.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 


@Component({
  standalone: true,
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css'],
  imports: [CommonModule]
})

export class SalesComponent implements OnInit {
  sales: Sale[] = [];

  constructor(private salesService: SalesService) {}

  ngOnInit(): void {
    this.loadSales();
  }

  loadSales(): void {
    this.salesService.getAllSales().subscribe({
      next: (data) => {
        this.sales = data;
      },
      error: (err) => {
        console.error('Error loading sales:', err);
      }
    });
  }
}
