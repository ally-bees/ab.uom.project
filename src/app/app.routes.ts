import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { OrderSummaryComponent } from './pages/order-summary/order-summary.component';
import { InventoryDashboardComponent } from './pages/inventory-dashboard/inventory-dashboard.component';
import { PrintReportComponent } from './components/print-report/print-report.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { UserProfileComponent } from './userprofile/userprofile.component';
import { SystemConfigComponent } from './adminpart/system-config/system-config.component';
import { AuditLogsComponent } from './adminpart/audit-logs/audit-logs.component';
import { UserManagementComponent } from './adminpart/user-management/user-management.component';
//import { DashboardComponent } from './adminpart/dashboard/dashboard.component';


export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
//   { path: '', redirectTo: 'order-summary', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'order-summary', component: OrderSummaryComponent},
  { path: 'inventory', component: InventoryDashboardComponent },
  {path: 'printreport', component:PrintReportComponent},
  { path:'login', component:LoginComponent},
  {path:'signup',component:SignupComponent},
  {path:'userprofile',component:UserProfileComponent},
  {path:'systemconfig',component:SystemConfigComponent},
  {path:'auditlogs',component:AuditLogsComponent},
  {path:'usermanagement',component:UserManagementComponent},
  { path: '**', redirectTo: 'dashboard' } // Redirect unknown routes to dashboard
];