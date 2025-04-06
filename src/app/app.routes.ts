import { Routes } from '@angular/router';
import { AuditLogsComponent } from "./adminpart/audit-logs/audit-logs.component";
import { SystemConfigComponent } from "./adminpart/system-config/system-config.component";
import { UserManagementComponent } from "./adminpart/user-management/user-management.component";
import { PrintReportComponent } from "./components/print-report/print-report.component";
import { LoginComponent } from "./login/login.component";
import { SalesMainpageComponent } from "./mainpage/sales-mainpage/sales-mainpage.component";
import { CourierDashboardComponent } from "./pages/courier/courier-dashboard.component";
import { customerinsightComponent } from "./pages/customer-insight/customer-insight.component";
import { FinanceComponent } from "./pages/finance/finance.component";
import { InventoryComponent } from "./pages/inventory/inventory.component";
import { MarketingAnalyticsDashboardComponent } from "./pages/marketing-analytics-dashboard/marketing-analytics-dashboard.component";
import { OrderSummaryComponent } from "./pages/order-summary/order-summary.component";
import { SalesDashboardComponent } from "./pages/sales-dashboard/sales-dashboard.component";
import { SalesComponent } from "./pages/sales/sales.component";
import { ShippingDashboardComponent } from "./pages/shipping-dashboard/shipping-dashboard.component";
import { SignupComponent } from "./signup/signup.component";
import { UserProfileComponent } from "./userprofile/userprofile.component";

export const routes: Routes = [
  { path: '', redirectTo: 'salespage', pathMatch: 'full' },

  // Standalone routes
  { path:'login', component:LoginComponent },
  { path:'signup', component:SignupComponent },
  { path:'userprofile', component:UserProfileComponent },
  { path:'systemconfig', component:SystemConfigComponent },
  { path:'auditlogs', component:AuditLogsComponent },
  { path:'usermanagement', component:UserManagementComponent },
  { path:'printreport', component:PrintReportComponent },

  // Salespage layout with child routes
  {
    path: 'salespage',
    component: SalesMainpageComponent,
    children: [
      { path: '', redirectTo: 'sales-dashboard', pathMatch: 'full' },
      { path: 'sales-dashboard', component: SalesDashboardComponent },
      { path: 'sales', component: SalesComponent},
      { path: 'order-summary', component: OrderSummaryComponent },
      { path: 'shipping-dashboard', component: ShippingDashboardComponent },
      { path: 'inventory', component: InventoryComponent },
      { path: 'courier', component: CourierDashboardComponent },
      { path: 'finance', component: FinanceComponent},
      { path: 'customer-insights', component: customerinsightComponent },
      { path: 'analytics', component: MarketingAnalyticsDashboardComponent}
    ]
  },

  { path: '**', redirectTo: 'salespage' }
];
