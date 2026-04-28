const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");
const authMiddleware = require("../middleware/authMiddleware");

// CREAR GASTO
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, amount, category } = req.body;

    const expense = new Expense({
      user: req.user.id,
      title,
      amount,
      category
    });

    await expense.save();

    res.status(201).json(expense);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// OBTENER GASTOS DEL USUARIO
router.get("/", authMiddleware, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

// EDITAR GASTO
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { title, amount, category } = req.body;

    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { title, amount, category },
      { new: true }
    );

    if (!expense) {
      return res.status(404).json({ message: "Gasto no encontrado" });
    }

    res.json(expense);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ELIMINAR GASTO
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!expense) {
      return res.status(404).json({ message: "Gasto no encontrado" });
    }

    res.json({ message: "Gasto eliminado" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});