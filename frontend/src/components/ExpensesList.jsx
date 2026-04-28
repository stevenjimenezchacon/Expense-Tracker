import ExpenseItem from "./ExpenseItem";

export default function ExpensesList({ expenses }) {
  return (
    <div>
      {expenses.map((expense) => (
        <ExpenseItem key={expense.id} expense={expense} />
      ))}
    </div>
  );
}