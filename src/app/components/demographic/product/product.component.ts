import { Component } from '@angular/core';
import { productservice } from './product.service';

interface Topproduct{
  proid : string,
  name: string,
  imgurl :string
}

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
  
    constructor(private productservice:productservice){
      
    }
    ngOnInit(): void {
      this.getproRecords();
    }
  
    getproRecords(): void {
      this.productservice.getproRecords().subscribe(records => {
        this.topproduct = records;
      });
    }
}
