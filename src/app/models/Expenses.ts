export interface Expenses {
  id: string
  userId: string,
  spentAt: string,
  title: string,
  amount: string,
  category: string,
  note: string,
}

export type ExpensesWithoutSpentAt = Omit<Expenses, 'spentAt'>;
export type ExpensesWithoutIdAndSpentAt = Omit<Expenses, 'userId' | 'spentAt'>;
