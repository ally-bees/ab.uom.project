import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';

// Components
import { AppComponent } from './app.component';
import { FormComponent } from './form/form.component';
import { CourierDashboardComponent } from './pages/courier/courier-dashboard.component';
import { MarketingDashboardComponent } from './pages/marketing-dashboard/marketing-dashboard.component';
import { ShippingDashboardComponent } from './pages/shipping-dashboard/shipping-dashboard.component';
import { SalesComponent } from './pages/sales/sales.component';
import { ExpenseFormComponent } from './pages/expense-form/expense-form.component';
import { BusinessMainpageComponent } from './mainpage/business-mainpage/bussiness-mainpage.component';
import { BusinessDashComponent } from './pages/businessowner/businessowner.component';
import { SalesHeatmapComponent } from './components/sales-heatmap/sales-heatmap.component';

// Material Modules
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

// AG Grid
import { AgGridModule } from 'ag-grid-angular';
import { NgChartsModule } from 'ng2-charts';

// ModuleRegistry.registerModules([ClientSideRowModelModule]);

@NgModule({
  declarations: [
  ],
  imports: [
    MarketingDashboardComponent,
    SalesHeatmapComponent,
    BrowserModule,
    SalesComponent,
    BrowserAnimationsModule,
    CommonModule,
    FormComponent,
    AppComponent,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,  
    MatCardModule,
    MatDividerModule,
    ShippingDashboardComponent,
    CourierDashboardComponent,
    BusinessMainpageComponent,
    HttpClientModule,
    AgGridModule,
    ExpenseFormComponent,
    BusinessDashComponent,
    NgChartsModule
  ],
  providers: [
    DatePipe,
    provideHttpClient()
  ]
})
export class AppModule { }