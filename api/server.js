const express = require("express");
const mysql = require("mysql2/promise");

const app = express();
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10
});

app.get("/health", async (_req, res) => {
  const [rows] = await pool.query("SELECT 1 AS ok");
  res.json({ ok: rows[0].ok === 1 });
});

app.post("/registros", async (req, res) => {
  const { nombre, fecha, esActivo, categoria, cantidad, descripcion } = req.body;

  const [result] = await pool.query(
    `INSERT INTO registros (nombre, fecha, esActivo, categoria, cantidad, descripcion)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [nombre, fecha, esActivo ?? true, categoria, cantidad, descripcion]
  );

  res.status(201).json({ id: result.insertId });
});

app.get("/registros", async (_req, res) => {
  const [rows] = await pool.query("SELECT * FROM registros ORDER BY id DESC");
  res.json(rows);
});

app.listen(3000, () => console.log("API listening on :3000"));