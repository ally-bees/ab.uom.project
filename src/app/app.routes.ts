import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { OrderSummaryComponent } from './pages/order-summary/order-summary.component';
import { InventoryDashboardComponent } from './pages/inventory-dashboard/inventory-dashboard.component';
import { PrintReportComponent } from './components/print-report/print-report.component';
import { DemographicComponent } from './components/demographic/demographic.component';
import { PurchasebehaveComponent } from './components/purchasebehave/purchasebehave.component';
import { RetentionanalComponent } from './components/retentionanal/retentionanal.component';
import { customerinsightComponent } from './pages/customer-insight/customer-insight.component';
import { AuditorspageComponent } from './auditorspage/auditorspage.component';
import { AuditdashboardcomponentComponent } from './auditdashboardcomponent/auditdashboardcomponent.component';



export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
//   { path: '', redirectTo: 'order-summary', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'Auditor', component: AuditorspageComponent },
  { path: 'order-summary', component: OrderSummaryComponent},
  { path: 'inventory', component: InventoryDashboardComponent },
  {path: 'printreport', component:PrintReportComponent},
  { 
    path: 'auditpage', 
    component: AuditorspageComponent, // The parent container
    children: [
      { path: '', component: AuditdashboardcomponentComponent },
      { path: 'customerinsight', 
        component: customerinsightComponent, 
        children: [
          { path: '', redirectTo: 'demographic', pathMatch: 'full' },
          { path: 'demographic', component: DemographicComponent },
          { path: 'purchase-behavior', component: PurchasebehaveComponent },
          { path: 'retention-analysis', component: RetentionanalComponent }
        ]
      }
    ]
  },
  { path: '**', redirectTo: 'dashboard' } // Redirect unknown routes to dashboard
];
  
  