import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BuyerComponent } from './buyer/buyer.component';
import {ProductComponent} from './product/product.component';
import { PurchasedetailsComponent } from './purchasedetails/purchasedetails.component';

@Component({
  selector: 'app-demographic',
  standalone:true,
  imports: [CommonModule,BuyerComponent,ProductComponent,PurchasedetailsComponent],
  templateUrl: './demographic.component.html',
  styleUrl: './demographic.component.css'
})
export class DemographicComponent {

}
