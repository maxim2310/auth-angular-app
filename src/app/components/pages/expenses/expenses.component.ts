import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject } from 'rxjs';
import { Expenses, ExpensesWithoutIdAndSpentAt } from 'src/app/models/Expenses';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { ExpensesService } from 'src/app/services/expenses.service';
import { UserService } from 'src/app/services/user.service';
import { ExpensesModalFormComponent } from '../../expenses-modal-form/expenses-modal-form.component';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss'],
})
export class ExpensesComponent implements AfterViewInit, OnInit {
  public userData$ = new BehaviorSubject<User | null>(null);
  displayedColumns: string[] = ['id', 'title', 'category', 'amount', 'spentAt', 'icon'];
  dataSource!: MatTableDataSource<Expenses>;
  pageSize = 10;
  totalExpenses = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private expensesService: ExpensesService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.dataSource = new MatTableDataSource<Expenses>();
    this.dataSource.sort = this.sort;
    this.authService.user$.subscribe((user) => {
      this.userData$.next(user);

      if (user && user?.id) {
        this.getUsers(user?.id);
      }
    });

    this.expensesService.expenses$.subscribe((expenses) => {
      if (expenses !== null) {
        this.dataSource.data = expenses;
        this.totalExpenses = expenses.length;
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getUsers(id: string) {
    this.expensesService.getExpenses(id).subscribe();
  }

  onPageChange(event: {
    previousPageIndex?: number;
    pageIndex?: number;
    pageSize: number;
    length?: number;
  }) {
    this.pageSize = event.pageSize;
  }

  addNewExpenses() {
    const expensesModal = ExpensesModalFormComponent.show(this.dialog);

    expensesModal
      .afterClosed()
      .subscribe(
        (result: ExpensesWithoutIdAndSpentAt) => {
          if (result) {
            this.expensesService.createExpenses({
              ...result,
              userId: this.userData$.getValue()?.id ?? ''
            }).subscribe()
          }
        }
      );
  }

  editExpenses(expenses: Expenses) {
    const expensesModal = ExpensesModalFormComponent.show(this.dialog, expenses);

    expensesModal
    .afterClosed()
    .subscribe(
      (result: ExpensesWithoutIdAndSpentAt) => {
        if (result) {
          this.expensesService.updateExpenses({
            ...result,
            userId: this.userData$.getValue()?.id ?? ''
          }).subscribe()
        }
      }
    );
  }

  deleteExpenses(expenses: Expenses) {
    this.expensesService.deleteExpenses(expenses.id).subscribe()
  }
}
