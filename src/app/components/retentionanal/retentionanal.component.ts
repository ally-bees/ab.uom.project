import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomersummaryComponent } from './customersummary/customersummary.component';
import { TableComponent } from './table/table.component';

@Component({
  selector: 'app-retentionanal',
  standalone:true, 
  imports: [CommonModule, CustomersummaryComponent,TableComponent],
  templateUrl: './retentionanal.component.html',
  styleUrl: './retentionanal.component.css'
})
export class RetentionanalComponent {

}
