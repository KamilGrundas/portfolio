import { Routes } from '@angular/router';
import { PortfolioShell } from './portfolio/portfolio-shell/portfolio-shell';
import { LoginPage } from './auth/login-page/login-page';

export const routes: Routes = [
  { path: '', component: LoginPage },
  { path: ':user_url', component: PortfolioShell },
  { path: '**', redirectTo: '' },
];
