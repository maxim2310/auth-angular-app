import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { HomeComponent } from './components/pages/home/home.component';
import { UsersComponent } from './components/pages/users/users.component';
import { AuthInterceptor } from './interceptors/onRequest';
import { ResponseInterceptor } from './interceptors/onResponse';
import { ProfileModalComponent } from './components/profile-modal/profile-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ExpensesComponent } from './components/pages/expenses/expenses.component';
import { ExpensesModalFormComponent } from './components/expenses-modal-form/expenses-modal-form.component';
import {MatSelectModule} from '@angular/material/select';
import { GoogleLoginProvider, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UsersComponent,
    ProfileModalComponent,
    ExpensesComponent,
    ExpensesModalFormComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    HttpClientModule,
    MatSnackBarModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ResponseInterceptor,
      multi: true,
    },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '903934111711-9luvdq0j1c9q85momgf9k8c3dmbfn3k4.apps.googleusercontent.com'
            ),
          },
        ],
        onError: (err) => {
          console.error(err);
        },
      } as SocialAuthServiceConfig,
    },

  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
