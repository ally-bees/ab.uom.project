import { Routes } from '@angular/router';
import { SalestableComponent } from './pages/salestable/salestable.component';
import { LandingComponent } from './pages/landing/landing.component';
import { StockupdateComponent } from './components/stockupdate/stockupdate.component';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'landing', component: LandingComponent },
  { path: 'salestable', component: SalestableComponent },
  { path: 'stockupdate', component: StockupdateComponent },
];

export const AppRoutingModule = {
  routes,
}; 