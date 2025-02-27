import { Component, Input } from '@angular/core';
import { Product } from '../../models/product.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-top-selling',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top-selling.component.html',
  styleUrls: ['./top-selling.component.scss']
})
export class TopSellingComponent {
  @Input() products: Product[] = [];

 
  getBarWidth(value: number): number {
      return (value / 100) * 100;
     }
    
     getBarColor(index: number): string {
      const colors = [
       '#02518A',
       '#0077B6',
       '#0096C7',
       '#00B4D8',
       '#48CAE4',
       '#90E0EF',
       '#ADE8F4',
       '#CAF0F8'
      ];
      return colors[index % colors.length];
     }
}