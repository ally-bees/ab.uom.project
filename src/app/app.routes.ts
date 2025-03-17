import { Routes } from '@angular/router';
import { SalesDashboardComponent } from './pages/sales-dashboard/sales-dashboard.component';
import { OrderSummaryComponent } from './pages/order-summary/order-summary.component';
import { InventoryDashboardComponent } from './pages/inventory-dashboard/inventory-dashboard.component';
import { PrintReportComponent } from './components/print-report/print-report.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { UserProfileComponent } from './userprofile/userprofile.component';
import { SystemConfigComponent } from './adminpart/system-config/system-config.component';
import { AuditLogsComponent } from './adminpart/audit-logs/audit-logs.component';
import { UserManagementComponent } from './adminpart/user-management/user-management.component';
import { SalesComponent } from './pages/sales/sales.component';
import { InventoryComponent } from './pages/inventory/inventory.component';
import { AuditpageComponent } from './pages/auditpage/auditpage.component'
import { AuditdashboardComponent } from './pages/auditdashboard/auditdashboard.component';
import { DemographicComponent } from './components/demographic/demographic.component';
import { PurchasebehaveComponent } from './components/purchasebehave/purchasebehave.component';
import { RetentionanalComponent } from './components/retentionanal/retentionanal.component';
import { customerinsightComponent } from './pages/customer-insight/customer-insight.component';
import { DashboardComponent } from './adminpart/dashboard/dashboard.component';



export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
//   { path: '', redirectTo: 'order-summary', pathMatch: 'full' },
  { path: 'sales-dashboard', component: SalesDashboardComponent },
  {path: 'sales', component: SalesComponent},
  { path: 'order-summary', component: OrderSummaryComponent},
  { path: 'inventory-dashboard', component: InventoryDashboardComponent },
  { path: 'inventory', component: InventoryComponent},
  {path: 'printreport', component:PrintReportComponent},
  { path:'login', component:LoginComponent},
  {path:'signup',component:SignupComponent},
  {path:'userprofile',component:UserProfileComponent},
  {path:'systemconfig',component:SystemConfigComponent},
  {path:'auditlogs',component:AuditLogsComponent},
  {path:'usermanagement',component:UserManagementComponent},
  { path: 'inventory', component: InventoryDashboardComponent },
   {path: 'printreport', component:PrintReportComponent},
   {path: 'auditdashboard', component:AuditdashboardComponent},
   {path: 'audit', component:AuditpageComponent},
  {path: 'printreport', component:PrintReportComponent},
  { 
    path: 'customerinsight', 
    component: customerinsightComponent, 
    children: [
      { path: '', redirectTo: 'demographic', pathMatch: 'full' }, // Default redirect
      { path: 'demographic', component: DemographicComponent },
      { path: 'purchase-behavior', component: PurchasebehaveComponent },
      { path: 'retention-analysis', component: RetentionanalComponent }
    ] 
  },
  {path:'admindashboard',component:DashboardComponent},
  { path: '**', redirectTo: 'dashboard' } // Redirect unknown routes to dashboard
];
  
  
