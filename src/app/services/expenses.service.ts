import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, tap } from 'rxjs';
import { User } from '../models/User';
import { Expenses, ExpensesWithoutSpentAt } from '../models/Expenses';

@Injectable({
  providedIn: 'root',
})
export class ExpensesService {
  constructor(private http: HttpClient) {}

  private expenses = new BehaviorSubject<Expenses[]>([]);
  public expenses$ = this.expenses.asObservable();

  getExpenses(id: string) {
    return this.http
      .get<Expenses[]>(`${environment.BASE_URL}/expenses/${id}`)
      .pipe(tap((expenses) => this.expenses.next(expenses)));
  }

  createExpenses(data: ExpensesWithoutSpentAt) {
    return this.http
      .post<Expenses>(`${environment.BASE_URL}/expenses`, data)
      .pipe(
        tap((expenses) =>
          this.expenses.next([...this.expenses.getValue(), expenses])
        )
      );
  }

  updateExpenses(data: ExpensesWithoutSpentAt) {
    return this.http
      .patch<Expenses>(`${environment.BASE_URL}/expenses/${data.userId}`, data)
      .pipe(
        tap((newExpenses) => {
          const newValue = this.expenses.getValue().map((expenses) => {
            if (expenses.id === newExpenses.id) {
              return newExpenses;
            }

            return expenses;
          });

          this.expenses.next(newValue);
        })
      );
  }
  deleteExpenses(id: string) {
    return this.http.delete(`${environment.BASE_URL}/expenses/${id}`).pipe(
      tap(() => {
        const newValue = this.expenses.getValue().filter((expenses) => expenses.id !== id);

        this.expenses.next(newValue);
      })
    );
  }
}
