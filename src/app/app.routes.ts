import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { OrderSummaryComponent } from './pages/order-summary/order-summary.component';
import { InventoryDashboardComponent } from './pages/inventory-dashboard/inventory-dashboard.component';
import { PrintReportComponent } from './components/print-report/print-report.component';
import { AuditpageComponent } from './pages/auditpage/auditpage.component'
import { AuditdashboardComponent } from './pages/auditdashboard/auditdashboard.component';
import { AuditorpageComponent } from './mainpage/auditorpage/auditorpage.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
//   { path: '', redirectTo: 'order-summary', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'order-summary', component: OrderSummaryComponent},
  { path: 'inventory', component: InventoryDashboardComponent },
   {path: 'printreport', component:PrintReportComponent},
   { 
    path: 'auditpage', 
    component: AuditorpageComponent, // The parent container
    children: [
      { path: '', component: AuditdashboardComponent },
      {path: 'audit', component:AuditpageComponent}
    ]
   },
  { path: '**', redirectTo: 'dashboard' } // Redirect unknown routes to dashboard
];