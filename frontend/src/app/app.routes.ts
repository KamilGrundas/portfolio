import { Routes } from '@angular/router';
import { PortfolioShell } from './portfolio/portfolio-shell/portfolio-shell';

export const routes: Routes = [
  { path: 'portfolio/:user_url', component: PortfolioShell },
  { path: '**', redirectTo: 'portfolio/johndoe' },
];
