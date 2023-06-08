import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthLayoutComponent } from './components/auth/auth-layout/auth-layout.component';
import { HomeComponent } from './components/pages/home/home.component';
import { UsersComponent } from './components/pages/users/users.component';
import { AuthGuard } from './guards/auth.guard';
import { ExpensesComponent } from './components/pages/expenses/expenses.component';

const routes: Routes = [
  {
    path: '',
    component: ExpensesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    loadChildren: () =>
      import('./components/auth/auth-layout/auth-layout.module').then(
        (m) => m.AuthLayoutModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
