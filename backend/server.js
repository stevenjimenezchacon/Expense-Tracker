const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 RUTAS PRIMERO
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const authMiddleware = require("./middleware/authMiddleware");

app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({ message: "Acceso permitido", user: req.user });
});

const expenseRoutes = require("./routes/expenses");
app.use("/api/expenses", expenseRoutes);

// 🔥 CONEXIÓN DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB conectado"))
  .catch(err => console.log(err));

// 🔥 SERVER AL FINAL
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});