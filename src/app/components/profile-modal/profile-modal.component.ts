import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject, catchError, throwError } from 'rxjs';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile-modal',
  templateUrl: './profile-modal.component.html',
  styleUrls: ['./profile-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileModalComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<ProfileModalComponent>,
    private authServis: AuthService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private navService: NavigationService,
    private mat: SnackBarService
  ) {}
  public profileForm!: FormGroup;
  public showPassword = false;

  public passwordForm!: FormGroup;
  public changePassword = false;

  public user$ = new BehaviorSubject<User | null>(null);
  public loading$ = new BehaviorSubject(false);

  ngOnInit() {
    this.authServis.user$.subscribe((user) => {
      this.user$.next(user);
    });

    this.profileForm = this.formBuilder.group(
      {
        name: [this.user$.getValue()?.name],
        email: [this.user$.getValue()?.email],
        currentPassword: [''],
      },
      { validators: this.emailRequirePassword() }
    );

    this.passwordForm = this.formBuilder.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      repeatPassword: [
        '',
        [Validators.required, this.passwordMatchValidator()],
      ],
    });

    this.profileForm.valueChanges.subscribe((v) => {
      if (v.email !== this.user$.getValue()?.email) {
        this.showPassword = true;
      } else {
        this.showPassword = false;
      }
    });
  }

  static show(dialog: MatDialog) {
    dialog.open(ProfileModalComponent, {
      panelClass: 'profile_modal',
    });
  }

  close() {
    this.dialogRef.close();
  }

  emailRequirePassword(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const email = control.get('email')?.value;
      const currentPassword = control.get('currentPassword')?.value;

      if (email !== this.user$.getValue()?.email && !currentPassword) {
        control.get('currentPassword')?.setErrors({ currentPassword: true });
        return { currentPassword: true };
      } else {
        control.get('currentPassword')?.setErrors(null);

        return null;
      }
    };
  }

  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const newPassword = this.passwordForm?.get('newPassword')?.value;
      const repeatPassword = control.value;

      if (newPassword !== repeatPassword) {
        return { passwordMismatch: true };
      }

      return null;
    };
  }

  markFormGroupAsTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
    });
  }

  onSubmitProfileForm() {
    this.markFormGroupAsTouched(this.profileForm);
    if (this.profileForm.valid) {
      this.loading$.next(true);
      const userId = this.user$.getValue()?.id || '';

      this.userService
        .updateUser(userId, {
          ...this.passwordForm.value,
          ...this.profileForm.value,
        })
        .pipe(
          catchError((error) =>
            throwError(() => {
              this.mat.showMessage(error.error.message, 'close');
            })
          )
        )
        .subscribe((user) => {
          if (this.user$.getValue()?.email !== user.email) {
            this.dialogRef.close();
            this.authServis.logout();
            this.navService.activate();

            return;
          }

          this.mat.showMessage('Name was changed successfully!', 'OK', true);
          this.authServis.updateUserData(user);
        });
        this.loading$.next(false);
    }
  }
  onSubmitPasswordForm() {
    this.markFormGroupAsTouched(this.passwordForm);
    const userId = this.user$.getValue()?.id || '';

    if (this.passwordForm.valid) {
      console.log(this.passwordForm.value);
      this.loading$.next(true);

      this.userService
        .updateUser(userId, {
          ...this.profileForm.value,
          ...this.passwordForm.value,
        })
        .pipe(
          catchError((error) =>
            throwError(() => {
              this.mat.showMessage(error.error.message, 'close');
            })
          )
        )
        .subscribe(() => {
          this.mat.showMessage(
            'Password was changed successfully!',
            'OK',
            true
          );
        });
    }
    this.loading$.next(false);

  }
}
