import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValuerateComponent } from './valuerate/valuerate.component';

@Component({
  selector: 'app-purchasebehave',
  standalone:true,
  imports: [CommonModule,ValuerateComponent],
  templateUrl: './purchasebehave.component.html',
  styleUrl: './purchasebehave.component.css'
})
export class PurchasebehaveComponent {

}
