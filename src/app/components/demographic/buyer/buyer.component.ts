import { Component, OnInit } from '@angular/core';
import { buyerService,TopCustomer  } from './buyer.service';

@Component({
  selector: 'app-buyer',
  standalone: true,
  imports: [],
  templateUrl: './buyer.component.html',
  styleUrl: './buyer.component.css',
  providers: [buyerService] 
})
export class BuyerComponent implements OnInit {

  topCustomer: TopCustomer | null = null;
  errorMessage = '';

  constructor(private buyerservice:buyerService){
    
  }
  ngOnInit(): void {
    this.buyerservice.getbuyRecords().subscribe({
      next: (data) => {
        this.topCustomer = data;
      },
      error: (error) => {
        this.errorMessage = error.error || 'Failed to load top customer.';
      }
    });
  }

  
  }

