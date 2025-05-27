import { Component } from '@angular/core';
import { productservice, Topproduct } from './product.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
  providers: [productservice] 
  
})

export class ProductComponent {
  topproduct: Topproduct | null = null;
  errorMessage = '';

    constructor(private productservice:productservice){
      
    }
    ngOnInit(): void {
      this.productservice.getproRecords().subscribe({
        next: (data) => {
          this.topproduct = data;
        },
        error: (error) => {
          this.errorMessage = error.error || 'Failed to load top customer.';
        }
    });    }
  
}
