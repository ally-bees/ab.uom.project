import { Component } from '@angular/core';
import { TaxandfeesummaryComponent } from '../../components/taxandfeesummary/taxandfeesummary.component';
import { TaxandfeetableComponent } from '../../components/taxandfeetable/taxandfeetable.component';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FooterComponent } from '../../footer/footer.component';

@Component({
  selector: 'app-auditpage',
  standalone: true,
  imports: [  TaxandfeesummaryComponent,TaxandfeetableComponent,HeaderComponent,SidebarComponent,FooterComponent ],
  templateUrl: './auditpage.component.html',
  styleUrl: './auditpage.component.css'
})
export class AuditpageComponent {

}
