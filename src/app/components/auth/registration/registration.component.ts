import { SocialAuthService } from '@abacritt/angularx-social-login';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, catchError, takeUntil, throwError } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegistrationComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  private destroy$ = new Subject<void>();


  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private snackBar: SnackBarService,
    private nav: NavigationService,
    private socialAuthService: SocialAuthService

  ) {
    this.loginForm = this.formBuilder.group({
      name: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    this.socialAuthService.authState
    .pipe(takeUntil(this.destroy$))
    .subscribe((user) => {
      if (user) {
        this.auth.registrerWithGoogle(user)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => this.nav.expenses(),
          error: (error) => {
            this.snackBar.showMessage(error.error.message)
          }
        });
      }
    })
  }



  onSubmit() {
    this.auth
      .registrer(this.loginForm.value)
      .pipe(
        catchError((error) =>
          throwError(() => {
            this.snackBar.showMessage(error.message, 'close');
          })
        )
      )
      .subscribe(() => {
        this.nav.activate();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

}
