import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { MatTabGroup } from '@angular/material/tabs';


@Component({
  selector: 'app-forgot-password-modal',
  templateUrl: './forgot-password-modal.component.html',
  styleUrls: ['./forgot-password-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForgotPasswordModalComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<ForgotPasswordModalComponent>,
    private authServis: AuthService,
    private formBuilder: FormBuilder,
    private mat: SnackBarService,
    private cdr: ChangeDetectorRef
  ) {}

  public forgotForm!: FormGroup;
  public user$ = new BehaviorSubject<User | null>(null);
  public loading$ = new BehaviorSubject(false);

  @ViewChild('tabGroup') tabGroup!: MatTabGroup;

  static show(dialog: MatDialog) {
    dialog.open(ForgotPasswordModalComponent, {
      panelClass: 'profile_modal',
    });
  }

  close() {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.authServis.user$.subscribe((user) => {
      this.user$.next(user);
    });

    this.forgotForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      code: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', Validators.required],
      repeatPassword: [
        '',
        [this.passwordMatchValidator()],
      ],
    })
  }

  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const newPassword = this.forgotForm?.get('newPassword')?.value;
      const repeatPassword = control.value;

      if (newPassword !== repeatPassword) {
        return { passwordMismatch: true };
      }

      return null;
    };
  }

  selectNextTab() {
    const selectedIndex = this.tabGroup.selectedIndex ?? 0;
    const nextIndex = selectedIndex < this.tabGroup._tabs.length - 1 ? selectedIndex + 1 : 0;
    this.tabGroup.selectedIndex = nextIndex
    this.cdr.detectChanges();
  }

  onSendEmailPart() {

    if (this.forgotForm.get('email')?.valid) {

      this.authServis.restorePasswordEmailPart(this.forgotForm.get('email')?.value).subscribe(() => {
        this.mat.showMessage('Restore code has been sent to your email', 'Ok', true)
        this.selectNextTab()
    },
    () => {
      this.mat.showMessage('thomething goes wrong', 'Ok');
    })
  }
}

  onSendRestoreCodePart() {
    if (this.forgotForm.get('code')?.valid) {
      this.authServis.checkRestoreCode(this.forgotForm.get('code')?.value).subscribe(() => {
        this.mat.showMessage('Restore code has been accepted', 'Ok', true);
        this.selectNextTab()
      },
      () => {
        this.mat.showMessage('Your code is wrong', 'Ok');
      })
    }
  }

  onSendNewPasswordPart() {
    if (this.forgotForm.get('repeatPassword')?.valid && this.forgotForm.get('newPassword')?.valid) {
      this.authServis.changePassword(this.forgotForm.get('email')?.value, this.forgotForm.get('newPassword')?.value).subscribe(() => {
        this.mat.showMessage('Your Password was successfully changed, you can login with new credentials', 'Ok', true);
        this.dialogRef.close();
      },
      () => {
        this.mat.showMessage('thomething goes wrong', 'Ok');
      }
      )
    }
  }
}
