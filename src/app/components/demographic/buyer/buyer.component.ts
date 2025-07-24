// buyer.component.ts
import { Component, OnInit } from '@angular/core';
import { BuyerService, TopCustomer } from './buyer.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-buyer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './buyer.component.html',
  styleUrls: ['./buyer.component.css']
})
export class BuyerComponent implements OnInit {
  topCustomer: TopCustomer | null = null;
  errorMessage: string = '';
  isLoading: boolean = true;

  constructor(private buyerService: BuyerService) {}

  ngOnInit(): void {
    this.loadTopCustomer();
  }

  loadTopCustomer(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.buyerService.getTopCustomer().subscribe({
      next: (data: TopCustomer) => {
        this.topCustomer = data;
        this.isLoading = false;
      },
      error: (error: Error) => {
        console.error('Error loading top customer:', error);
        this.errorMessage = error.message;
        this.isLoading = false;
      }
    });
  }
}