import { Component } from '@angular/core';
import { TaxandfeesummaryComponent } from '../../components/taxandfeesummary/taxandfeesummary.component';
import { TaxandfeetableComponent } from '../../components/taxandfeetable/taxandfeetable.component';

@Component({
  selector: 'app-auditpage',
  standalone: true,
  imports: [  TaxandfeesummaryComponent,TaxandfeetableComponent ],
  templateUrl: './auditpage.component.html',
  styleUrl: './auditpage.component.css'
})
export class AuditpageComponent {

}
