import { openDatabaseAsync } from 'expo-sqlite';

let db = null;

async function getDatabase() {
  if (db) {
    return db;
  }
  db = await openDatabaseAsync('miApp.db');
  return db;
}

export async function initDatabase() {
  try {
    const database = await getDatabase();
    await database.runAsync(
      `CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario TEXT UNIQUE,
        password TEXT
      );`
    );
    await database.runAsync(
      `CREATE TABLE IF NOT EXISTS videojuegos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT,
        plataforma TEXT,
        genero TEXT
      );`
    );
  } catch (error) {
    console.log('Error inicializando base de datos:', error);
  }
}

export async function registerUser(usuario, password) {
  const database = await getDatabase();
  return database.runAsync('INSERT INTO usuarios (usuario, password) VALUES (?, ?);', usuario, password);
}

export async function getUser(usuario) {
  const database = await getDatabase();
  return database.getAllAsync('SELECT * FROM usuarios WHERE usuario = ?;', usuario);
}

export async function validateUser(usuario, password) {
  const database = await getDatabase();
  return database.getAllAsync('SELECT * FROM usuarios WHERE usuario = ? AND password = ?;', usuario, password);
}

export async function recoverPassword(usuario) {
  const database = await getDatabase();
  return database.getFirstAsync('SELECT password FROM usuarios WHERE usuario = ?;', usuario);
}

export async function addGame(nombre, plataforma, genero) {
  const database = await getDatabase();
  return database.runAsync('INSERT INTO videojuegos (nombre, plataforma, genero) VALUES (?, ?, ?);', nombre, plataforma, genero);
}

export async function getGames() {
  const database = await getDatabase();
  return database.getAllAsync('SELECT * FROM videojuegos ORDER BY id DESC;');
}

export async function updateGame(id, nombre, plataforma, genero) {
  const database = await getDatabase();
  return database.runAsync('UPDATE videojuegos SET nombre = ?, plataforma = ?, genero = ? WHERE id = ?;', nombre, plataforma, genero, id);
}

export async function deleteGame(id) {
  const database = await getDatabase();
  return database.runAsync('DELETE FROM videojuegos WHERE id = ?;', id);
}
