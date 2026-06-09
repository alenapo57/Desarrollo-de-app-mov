import * as SQLite from 'expo-sqlite';

let db = null;

/**
 * Retorna la instancia de la base de datos.
 * Si no existe, la crea y configura las tablas.
 */
export const getDatabase = async () => {
  if (db) return db;

  db = await SQLite.openDatabaseAsync('financontrol.db');

  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS usuarios (
      id       INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre   TEXT NOT NULL,
      email    TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS movimientos (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id  INTEGER NOT NULL,
      tipo        TEXT NOT NULL,
      categoria   TEXT NOT NULL,
      descripcion TEXT,
      monto       REAL NOT NULL,
      fecha       TEXT NOT NULL,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    );
  `);

  return db;
};