import { useState } from "react";

export default function DashboardPage({ expenses = [], onLogout, onRefresh }) {
  const [editingId, setEditingId] = useState(null);
  const [newTitle, setNewTitle] = useState("");

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");

  // ========================
  // CREATE EXPENSE
  // ========================
  const createExpense = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) return console.error("No hay token");

    try {
      const res = await fetch("http://localhost:3000/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          amount: Number(amount),
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        console.error("Error creando gasto:", data);
        return;
      }

      setTitle("");
      setAmount("");

      await onRefresh();

    } catch (error) {
      console.error("Error en createExpense:", error);
    }
  };

  // ========================
  // UPDATE EXPENSE
  // ========================
  const updateExpense = async (id) => {
    const token = localStorage.getItem("token");

    if (!token) return;

    try {
      const res = await fetch(`http://localhost:3000/api/expenses/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: newTitle }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        console.error("Error actualizando gasto:", data);
        return;
      }

      setEditingId(null);
      setNewTitle("");

      await onRefresh();

    } catch (error) {
      console.error(error);
    }
  };

  // ========================
  // DELETE EXPENSE
  // ========================
  const deleteExpense = async (id) => {
    const token = localStorage.getItem("token");

    if (!token) return;

    try {
      const res = await fetch(`http://localhost:3000/api/expenses/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        console.error("Error eliminando gasto:", data);
        return;
      }

      await onRefresh();

    } catch (error) {
      console.error(error);
    }
  };

  // ========================
  // UI
  // ========================
  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <h2 style={styles.title}>💰 Rastreador de gastos</h2>
        <button style={styles.logoutBtn} onClick={onLogout}>
          Logout
        </button>
      </div>

      {/* FORM */}
      <div style={styles.card}>
        <h3>➕ Nuevo gasto</h3>

        <form onSubmit={createExpense} style={styles.form}>
          <input
            style={styles.input}
            placeholder="Ej: Comida, Ropa..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            style={styles.input}
            placeholder="Monto"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <button type="submit" style={styles.addBtn}>
            Agregar
          </button>
        </form>
      </div>

      {/* LISTA */}
      <h3 style={{ marginTop: 20 }}>📊 Gastos</h3>

      <div style={styles.list}>
        {(expenses || []).map((exp) => (
          <div key={exp._id} style={styles.item}>
            {editingId === exp._id ? (
              <div style={styles.editBox}>
                <input
                  style={styles.input}
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />

                <button
                  type="button"
                  style={styles.saveBtn}
                  onClick={() => updateExpense(exp._id)}
                >
                  Guardar
                </button>

                <button
                  type="button"
                  style={styles.cancelBtn}
                  onClick={() => setEditingId(null)}
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <>
                <div>
                  <strong>{exp.title}</strong>
                  <div style={styles.amount}>₡{exp.amount}</div>
                </div>

                <div style={styles.actions}>
                  <button
                    type="button"
                    style={styles.editBtn}
                    onClick={() => {
                      setEditingId(exp._id);
                      setNewTitle(exp.title);
                    }}
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    style={styles.deleteBtn}
                    onClick={() => deleteExpense(exp._id)}
                  >
                    Eliminar
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ========================
   ESTILOS
======================== */

const styles = {
  container: {
    padding: 20,
    maxWidth: 700,
    margin: "0 auto",
    fontFamily: "Arial",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    margin: 0,
  },
  logoutBtn: {
    background: "#ff4d4d",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: 8,
    cursor: "pointer",
  },
  card: {
    marginTop: 20,
    padding: 15,
    borderRadius: 12,
    background: "#f5f5f5",
  },
  form: {
    display: "flex",
    gap: 10,
    marginTop: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    border: "1px solid #ccc",
  },
  addBtn: {
    background: "#4caf50",
    color: "white",
    border: "none",
    padding: "10px 14px",
    borderRadius: 8,
    cursor: "pointer",
  },
  list: {
    marginTop: 10,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  item: {
    display: "flex",
    justifyContent: "space-between",
    padding: 15,
    borderRadius: 12,
    background: "white",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
  amount: {
    color: "#666",
    marginTop: 5,
  },
  actions: {
    display: "flex",
    gap: 8,
    alignItems: "center",
  },
  editBtn: {
    background: "#2196f3",
    color: "white",
    border: "none",
    padding: "6px 10px",
    borderRadius: 6,
    cursor: "pointer",
  },
  deleteBtn: {
    background: "#f44336",
    color: "white",
    border: "none",
    padding: "6px 10px",
    borderRadius: 6,
    cursor: "pointer",
  },
  saveBtn: {
    background: "#4caf50",
    color: "white",
    border: "none",
    padding: "6px 10px",
    borderRadius: 6,
  },
  cancelBtn: {
    background: "#999",
    color: "white",
    border: "none",
    padding: "6px 10px",
    borderRadius: 6,
  },
  editBox: {
    display: "flex",
    gap: 10,
    width: "100%",
  },
};