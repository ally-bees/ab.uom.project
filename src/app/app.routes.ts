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
import { MarketingAnalyticsDashboardComponent } from './pages/marketing-analytics-dashboard/marketing-analytics-dashboard.component';
import { CourierDashboardComponent } from './pages/courier/courier-dashboard.component';

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
  {path:'analytics',component:MarketingAnalyticsDashboardComponent},
  {path:'courier',component:CourierDashboardComponent},
  { path: '**', redirectTo: 'dashboard' } // Redirect unknown routes to dashboard
];
