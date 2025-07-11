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
import { ForgetPasswordComponent } from './adminpart/forget-password/forget-password.component';
import { PrivacyPolicyComponent } from './adminpart/privacy-policy/privacy-policy.component';
import { TermsOfServiceComponent } from './adminpart/terms-of-service/terms-of-service.component';
import { ResetPasswordComponent } from './adminpart/reset-password/reset-password.component';

import { TestsalesDashboardComponent } from './dashboards/testsales-dashboard/testsales-dashboard.component';
import { TestbusinessDashboardComponent } from './dashboards/testbusiness-dashboard/testbusiness-dashboard.component';
import { TestinventoryDashboardComponent } from './dashboards/testinventory-dashboard/testinventory-dashboard.component';
import { TestmarketingDashboardComponent } from './dashboards/testmarketing-dashboard/testmarketing-dashboard.component';

import { AuditpageComponent } from './pages/auditpage/auditpage.component';
import { AuditdashboardComponent } from './pages/auditdashboard/auditdashboard.component';
import { AuditorpageComponent } from './mainpage/auditorpage/auditorpage.component';

import { DemographicComponent } from './components/demographic/demographic.component';
import { PurchasebehaveComponent } from './components/purchasebehave/purchasebehave.component';
import { RetentionanalComponent } from './components/retentionanal/retentionanal.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Auth
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'forget-password', component: ForgetPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },

  // Admin-only
  { path: 'admindashboard', component: DashboardComponent, canActivate: [adminGuard] },
  { path: 'systemconfig', component: SystemConfigComponent, canActivate: [adminGuard] },
  { path: 'auditlogs', component: AuditLogsComponent, canActivate: [adminGuard] },
  { path: 'usermanagement', component: UserManagementComponent, canActivate: [adminGuard] },

  // Sales Manager
  {
    path: 'salesmanager',
    component: SalesMainpageComponent,
    canActivate: [salesManagerGuard],
    children: [
      { path: '', redirectTo: 'salesdashboard', pathMatch: 'full' },
      { path: 'salesdashboard', component: SalesDashboardComponent },
      { path: 'sales', component: SalesComponent },
      { path: 'order', component: OrderSummaryComponent },
      {
        path: 'customerinsight',
        component: customerinsightComponent,
        children: [
          { path: '', redirectTo: 'demographic', pathMatch: 'full' },
          { path: 'demographic', component: DemographicComponent },
          { path: 'purchase-behavior', component: PurchasebehaveComponent },
          { path: 'retention-analysis', component: RetentionanalComponent }
        ]
      },
      { path: 'printreport', component: PrintReportComponent },
      { path: 'expense-form', component: ExpenseFormComponent }
    ]
  },

  // Inventory Manager
  {
    path: 'testinventorymanager',
    component: TestinventoryDashboardComponent,
    canActivate: [inventoryManagerGuard],
    children: [
      { path: '', redirectTo: 'inventoryDashboard', pathMatch: 'full' },
      { path: 'inventoryDashboard', component: InventoryDashboardComponent },
      { path: 'inventory', component: InventoryComponent },
      { path: 'order', component: OrderSummaryComponent }
    ]
  },

  // Business Owner
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
      { path: 'sales', component: SalesComponent },
      { path: 'customerinsight', component: customerinsightComponent },
      { path: 'order', component: OrderSummaryComponent },
      { path: 'analytics', component: MarketingAnalyticsDashboardComponent },
      { path: 'printreport', component: PrintReportComponent },
      { path: 'expense-form', component: ExpenseFormComponent }
    ]
  },

  // Marketing Manager
  {
    path: 'testmarketingmanager',
    component: TestmarketingDashboardComponent,
    canActivate: [marketingManagerGuard]
  },

  // General Authenticated Routes
  { path: 'userprofile', component: UserProfileComponent, canActivate: [authGuard] },
  { path: 'finance', component: FinanceComponent, canActivate: [authGuard] },
  { path: 'schedule', component: ScheduleComponent, canActivate: [authGuard] },
  { path: 'shipping', component: ShippingDashboardComponent, canActivate: [authGuard] },

  { path: 'sales-heatmap', component: SalesHeatmapComponent, canActivate: [authGuard] },
  { path: 'top-selling', component: TopSellingComponent, canActivate: [authGuard] },
  { path: 'stats', component: StatsCardComponent, canActivate: [authGuard] },
  { path: 'top', component: TopSellingTableComponent, canActivate: [authGuard] },

  // Audit
  { path: 'auditpage', component: AuditpageComponent },
  { path: 'auditdashboard', component: AuditdashboardComponent },
  { path: 'auditorpage', component: AuditorpageComponent },

  // Policies
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'terms-of-service', component: TermsOfServiceComponent },

  // Fallback
  { path: '**', redirectTo: 'login' }
];
