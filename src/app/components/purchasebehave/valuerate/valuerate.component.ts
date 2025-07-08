import { Component } from '@angular/core';
import { valuerateservice, Pur } from './valuerate.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-valuerate',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './valuerate.component.html',
  styleUrl: './valuerate.component.css',
  providers: [valuerateservice] 
  
})

export class ValuerateComponent {
  productIds: string[] = ['P002', 'P003', 'P004']; // Replace with actual product IDs or fetch dynamically
  pur?: Pur;
  purchaseRate: number = 0;
  selectedProductId: string = 'Product ID';

  constructor(private valuerateservice: valuerateservice) {}

  ngOnInit(): void {}

  selectProduct(productId: string) {
    this.selectedProductId = productId;
    this.valuerateservice.getpur(productId).subscribe({
      next: data => {
        this.pur = data;
        this.purchaseRate = data.totalCustomerCount
          ? (data.productSoldCount / data.totalCustomerCount) * 100
          : 0;
      },
      error: () => {
        this.pur = undefined;
        this.purchaseRate = 0;
      }
    });
  }
}
