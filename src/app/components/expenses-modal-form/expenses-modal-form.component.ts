import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { NavigationService } from 'src/app/services/navigation.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { ProfileModalComponent } from '../profile-modal/profile-modal.component';

@Component({
  selector: 'app-expenses-modal-form',
  templateUrl: './expenses-modal-form.component.html',
  styleUrls: ['./expenses-modal-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpensesModalFormComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<ExpensesModalFormComponent>,
    private formBuilder: FormBuilder,
    private navService: NavigationService,
    private mat: SnackBarService,
    @Inject(MAT_DIALOG_DATA)
    public modalData: {
      title: string;
      category: string;
      amount: string;
      note: string;
    }
  ) {}

  public expensesForm!: FormGroup;
  expenseCategories: string[] = [
    'Food and Dining',
    'Transportation',
    'Housing',
    'Utilities',
    'Entertainment',
    'Healthcare',
    'Education',
    'Travel',
    'Shopping',
    'Personal Care',
    'Insurance',
    'Gifts and Donations',
    'Debt Payments',
    'Savings',
  ];

  static show(
    dialog: MatDialog,
    modalData = { title: '', category: '', amount: '', note: '' }
  ) {
    const expensesModal = dialog.open(ExpensesModalFormComponent, {
      data: modalData,
      panelClass: 'expenses_modal',
    });

    return expensesModal;
  }

  close() {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.expensesForm = this.formBuilder.group({
      title: [this.modalData.title, Validators.required],
      category: [this.modalData.category, Validators.required],
      amount: [this.modalData.amount, Validators.required],
      note: [this.modalData.note],
    });
  }

  onSubmit() {
    this.dialogRef.close(this.expensesForm.value);
  }

  isChanged() {
    return (
      this.modalData.amount !== this.expensesForm.value.amount ||
      this.modalData.category !== this.expensesForm.value.category ||
      this.modalData.note !== this.expensesForm.value.note ||
      this.modalData.title !== this.expensesForm.value.title
    );
  }
}
