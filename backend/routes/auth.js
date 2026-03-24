const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// REGISTRO
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({ message: "Usuario creado" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;