const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

const app = express();
app.use(cors());
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
  try {
    const [result] = await pool.query(
      `INSERT INTO registros (nombre, fecha, esActivo, categoria, cantidad, descripcion)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre, fecha, esActivo ?? true, categoria, cantidad, descripcion]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    console.error("Error inserting registro:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/registros", async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM registros ORDER BY id DESC");
    console.log('GET /registros returned rows:', rows);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching registros:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/registros/:id", async (req, res) => {
  const { id } = req.params;
  const [rows] = await pool.query("SELECT * FROM registros WHERE id = ?", [id]);
  
  if (rows.length === 0) {
    return res.status(404).json({ error: "Registro no encontrado" });
  }
  
  res.json(rows[0]);
});

app.put("/registros/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, fecha, esActivo, categoria, cantidad, descripcion } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE registros SET nombre = ?, fecha = ?, esActivo = ?, categoria = ?, cantidad = ?, descripcion = ? WHERE id = ?`,
      [nombre, fecha, esActivo ?? true, categoria, cantidad, descripcion, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Registro no encontrado" });
    }

    res.json({ message: "Registro actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/registros/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query("DELETE FROM registros WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Registro no encontrado" });
    }

    res.json({ message: "Registro eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// global error handler to avoid crashes
app.use((err, req, res, next) => {
  console.error('Unhandled error', err);
  if (!res.headersSent) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(3000, () => console.log("API listening on :3000"));