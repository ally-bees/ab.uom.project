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
  productIds: string[] = [
  'P002', 'P003', 'P004', 'P005', 'P006', 'P007', 'P008', 'P009', 'P010',
  'P011', 'P012', 'P013', 'P014', 'P015', 'P016', 'P017', 'P018', 'P019', 'P020',
  'P021', 'P022', 'P023', 'P024', 'P025', 'P026', 'P027', 'P028', 'P029', 'P030',
  'P031', 'P032', 'P033', 'P034', 'P035', 'P036', 'P037', 'P038', 'P039', 'P040',
  'P041', 'P042', 'P043', 'P044', 'P045', 'P046', 'P047', 'P048', 'P049', 'P050'
];
 // Replace with actual product IDs or fetch dynamically
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
