import { Routes } from '@angular/router';
import { SalestableComponent } from './pages/salestable/salestable.component';
import { LandingComponent } from './pages/landing/landing.component';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'landing', component: LandingComponent },
  { path: 'salestable', component: SalestableComponent },
];

export const AppRoutingModule = {
  routes,
}; 