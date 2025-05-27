import { Component } from '@angular/core';
import { PastauditComponent } from '../../components/pastaudit/pastaudit.component';
import { AuditsummaryComponent } from '../../components/auditsummary/auditsummary.component';
import { AuditstatustrackerComponent } from '../../components/auditstatustracker/auditstatustracker.component';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FooterComponent } from '../../footer/footer.component';

@Component({
  selector: 'app-auditdashboard',
  standalone: true,
  imports: [ PastauditComponent,AuditsummaryComponent,AuditstatustrackerComponent  ],
  templateUrl: './auditdashboard.component.html',
  styleUrl: './auditdashboard.component.css'
})
export class AuditdashboardComponent {

}
