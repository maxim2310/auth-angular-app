import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, catchError, throwError } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { ForgotPasswordModalComponent } from '../forgot-password-modal/forgot-password-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  loginForm: FormGroup;
  public loading$ = new BehaviorSubject(false);


  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private snackBar: SnackBarService,
    private nav: NavigationService,
    private dialog: MatDialog
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading$.next(true)
      this.auth
      .login(this.loginForm.value)
      .pipe(
        catchError((error) =>
          throwError(() => {
            this.snackBar.showMessage(error.error.message, 'close');
          })
        )
      )
      .subscribe(() => {
        this.nav.users();
      });
    }
    this.loading$.next(false)
  }

  forgotPassword() {
    ForgotPasswordModalComponent.show(this.dialog)
  }
}
