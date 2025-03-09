import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValuerateComponent } from './valuerate/valuerate.component';
import { DetailgraphComponent} from './detailgraph/detailgraph.component';

@Component({
  selector: 'app-purchasebehave',
  standalone:true,
  imports: [CommonModule,ValuerateComponent,DetailgraphComponent],
  templateUrl: './purchasebehave.component.html',
  styleUrl: './purchasebehave.component.css'
})
export class PurchasebehaveComponent {

}
