
import { Routes } from '@angular/router';
import {
  authGuard,
  adminGuard,
  businessOwnerGuard,
  salesManagerGuard,
  marketingManagerGuard,
  inventoryManagerGuard
} from './guards/auth.guard';

import { SalesDashboardComponent } from './pages/sales-dashboard/sales-dashboard.component';
import { OrderSummaryComponent } from './pages/order-summary/order-summary.component';
import { PrintReportComponent } from './pages/print-report/print-report.component';
import { InventoryDashboardComponent } from './pages/inventory-dashboard/inventory-dashboard.component';
import { BusinessDashComponent } from './pages/businessowner/businessowner.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { UserProfileComponent } from './userprofile/userprofile.component';
import { SystemConfigComponent } from './adminpart/system-config/system-config.component';
import { AuditLogsComponent } from './adminpart/audit-logs/audit-logs.component';
import { UserManagementComponent } from './adminpart/user-management/user-management.component';
import { SalesComponent } from './pages/sales/sales.component';
import { InventoryComponent } from './pages/inventory/inventory.component';
import { MarketingAnalyticsDashboardComponent } from './pages/marketing-analytics-dashboard/marketing-analytics-dashboard.component';
import { FinanceComponent } from './pages/finance/finance.component';
import { ScheduleComponent } from './pages/schedule/schedule.component';
import { ShippingDashboardComponent } from './pages/shipping-dashboard/shipping-dashboard.component';
import { SalesMainpageComponent } from './mainpage/sales-mainpage/sales-mainpage.component';
import { InventoryMainpageComponent } from './mainpage/inventory-mainpage/inventory-mainpage.component';
import { BusinessMainpageComponent } from './mainpage/business-mainpage/bussiness-mainpage.component';
import { ExpenseFormComponent } from './pages/expense-form/expense-form.component';
import { DashboardComponent } from './adminpart/dashboard/dashboard.component';
import { customerinsightComponent } from './pages/customer-insight/customer-insight.component';
import { SalesHeatmapComponent } from './components/sales-heatmap/sales-heatmap.component';
import { TopSellingComponent } from './components/top-selling/top-selling.component';
import { StatsCardComponent } from './components/stats-card/stats-card.component';
import { TopSellingTableComponent } from './components/top-selling-table/top-selling-table.component';
import { CourierDashboardComponent } from './pages/courier/courier-dashboard.component';
import { MarketingDashboardComponent } from './pages/marketing-dashboard/marketing-dashboard.component';

export const routes: Routes = [
  // Default route
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Auth routes
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'forget-password', component: ForgetPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },

  // Admin-only routes
  { path: 'admindashboard', component: DashboardComponent, canActivate: [adminGuard] },
  { path: 'systemconfig', component: SystemConfigComponent, canActivate: [adminGuard] },
  { path: 'auditlogs', component: AuditLogsComponent, canActivate: [adminGuard] },
  { path: 'usermanagement', component: UserManagementComponent, canActivate: [adminGuard] },

  // Business owner
  { path: 'testbusinessowner', component: TestbusinessDashboardComponent, canActivate: [businessOwnerGuard] },

// Sales Manager with child routes
{
  path: 'salesmanager',
  component: SalesMainpageComponent,
  canActivate: [salesManagerGuard],
  children: [
      { path: '', redirectTo: 'salesdashboard', pathMatch: 'full' },
      { path: 'salesdashboard', component: SalesDashboardComponent },
      { path: 'sales', component: SalesComponent },
      { path: 'order', component: OrderSummaryComponent },
      { path:'customerinsight',component:customerinsightComponent},
      { path: 'printreport', component: PrintReportComponent },
      {path: 'expense-form', component: ExpenseFormComponent}

    ]
  },

  // Inventory Manager with child routes
  {
    path: 'testinventorymanager',
    component: TestinventoryDashboardComponent,
    canActivate: [inventoryManagerGuard],
    children: [
      { path: '', redirectTo: 'inventoryDashboard', pathMatch: 'full' },
      { path: 'inventoryDashboard', component: InventoryDashboardComponent },
      { path: 'inventory', component: InventoryComponent },
      { path: 'order', component: OrderSummaryComponent },
      {path: 'expense-form', component: ExpenseFormComponent}
    ]
  },

  // Marketing Manager
  {
    path: 'testmarketingmanager',
    component: TestmarketingDashboardComponent,
    canActivate: [marketingManagerGuard]
  },

  {
    path: 'businessowner',
    component: BusinessMainpageComponent,
    canActivate: [businessOwnerGuard],
    children: [
      { path: '', redirectTo: 'businessownerdashboard', pathMatch: 'full' },
      { path: 'businessownerdashboard', component: BusinessDashComponent },
      { path: 'finance', component: FinanceComponent },
      { path: 'inventory', component: InventoryComponent },
      { path: 'schedule', component: ScheduleComponent },
      { path: 'shipping', component: ShippingDashboardComponent },
      { path : 'sales', component: SalesComponent },
      { path: 'customerinsight', component: customerinsightComponent },
      { path: 'order', component: OrderSummaryComponent },
      { path: 'analytics', component: MarketingAnalyticsDashboardComponent },

    ]
  },
  { path: 'order-summary', component: OrderSummaryComponent},
  {path: 'printreport', component:PrintReportComponent},
  { path:'login', component:LoginComponent},
  {path:'signup',component:SignupComponent},
  {path:'userprofile',component:UserProfileComponent},
  {path:'systemconfig',component:SystemConfigComponent},
  {path:'auditlogs',component:AuditLogsComponent},
  {path:'usermanagement',component:UserManagementComponent},
  {path:'analytics',component:MarketingAnalyticsDashboardComponent},
  {path: 'bussinessownerdash', component: BusinessDashComponent}, 
  {path: 'finance', component: FinanceComponent},
  {path: 'schedule', component: ScheduleComponent},
  {path: 'shipping', component: ShippingDashboardComponent},
  {path:'admindashboard',component:DashboardComponent},
  {path:'customerinsight',component:customerinsightComponent},
  {path: 'expense-form', component: ExpenseFormComponent},
  {path: 'salesmainpage', component: SalesMainpageComponent},
  {path: 'sales-heatmap', component: SalesHeatmapComponent},
  {path: 'top-selling', component: TopSellingComponent},
  {path: 'stats', component: StatsCardComponent},
  {path: 'Top', component: TopSellingTableComponent},
  {path: 'expense-form', component: ExpenseFormComponent},
  { path: '**', redirectTo: 'salesdashboard' },
  {path: 'courier', component: CourierDashboardComponent},
  {path: 'marketing', component: MarketingDashboardComponent},
];

/*{
  path: 'businessowner',
  component: SalesMainpageComponent,
  children: [
    { path: '', redirectTo: 'salesdashboard', pathMatch: 'full' },
    { 
      path: 'bo-customersupport',
      component: BocustomersupportComponent,
      children: [
        { path: '', redirectTo: 'social-connect', pathMatch: 'full' },
        { path: 'chatbot', component: AimessagepanelComponent },
        { path: 'social-connect', component: SocialmessagepanelComponent },
        { path: 'app-bochatpanel', component: BochatpanelComponent }
      ]
    }
  ]
},*/

