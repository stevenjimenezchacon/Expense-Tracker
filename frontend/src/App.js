import { useState, useEffect } from "react";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";

export default function App() {
  const [isLogged, setIsLogged] = useState(false);
  const [expenses, setExpenses] = useState([]);

  // 🔐 verificar token al iniciar
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsLogged(true);
  }, []);

  // 📦 cargar expenses cuando loguea
  useEffect(() => {
    if (isLogged) {
      fetchExpenses();
    }
  }, [isLogged]);

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        handleLogout();
        return;
      }

      const res = await fetch("http://localhost:3000/api/expenses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json().catch(() => []);

      if (!res.ok) {
        console.error("Error backend:", data);

        // 🔥 logout automático si token inválido
        if (res.status === 401 || res.status === 403) {
          handleLogout();
        }

        return;
      }

      setExpenses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLoginSuccess = () => {
    setIsLogged(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLogged(false);
    setExpenses([]);
  };

  if (!isLogged) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <DashboardPage
      expenses={expenses}
      onLogout={handleLogout}
      onRefresh={fetchExpenses}
    />
  );
}