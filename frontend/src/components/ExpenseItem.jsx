export default function ExpenseItem({ expense }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        border: "1px solid #ddd",
        padding: "10px",
        margin: "10px 0",
        borderRadius: "8px",
      }}
    >
      <span>{expense.name}</span>
      <span>₡{expense.amount}</span>
    </div>
  );
}