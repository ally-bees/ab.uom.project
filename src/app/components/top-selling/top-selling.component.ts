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
    const maxValue = Math.max(...this.products.map(p => p.value));
    return (value / maxValue) * 100;
  }
}