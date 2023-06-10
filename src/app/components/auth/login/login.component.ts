import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Subject, catchError, takeUntil, throwError } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { ForgotPasswordModalComponent } from '../forgot-password-modal/forgot-password-modal.component';
import { MatDialog } from '@angular/material/dialog';
import {
  SocialAuthService,
  GoogleLoginProvider,
  SocialUser,
} from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  public loading$ = new BehaviorSubject(false);
  private destroy$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private snackBar: SnackBarService,
    private nav: NavigationService,
    private dialog: MatDialog,
    private socialAuthService: SocialAuthService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  ngOnInit(): void {
    this.socialAuthService.authState
    .pipe(takeUntil(this.destroy$))
    .subscribe((user) => {
      if (user && user?.id) {
        this.auth.login({...user, password: user.id}).subscribe(() => {
          this.nav.expenses();
        });
      }
    })
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
        this.nav.expenses();
      });
    }
    this.loading$.next(false)
  }

  forgotPassword() {
    ForgotPasswordModalComponent.show(this.dialog)
  }

  ngOnDestroy() {
    this.destroy$.next();
  }


}
