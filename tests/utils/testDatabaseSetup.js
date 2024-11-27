import sqlite3 from "sqlite3"
import bcrypt from "bcrypt"
import fs from "fs"
import path from "path"

import logger from "../../src/logger"

const initializeTestDatabase = async () => {
  const dbPath = path.resolve("testdatabase.db")

  /* ----------------- Drop the existing database if it exists ---------------- */
  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath)
    logger.info("Existing database dropped.")
  }

  const db = new sqlite3.Database(dbPath)

  /* -------------------------- Create 'users' table -------------------------- */
  await new Promise((resolve, reject) => {
    db.run(
      `CREATE TABLE users (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         username TEXT NOT NULL UNIQUE,
         password TEXT NOT NULL,
         idCard TEXT,
         name TEXT,
         role TEXT,
         status TEXT
       );`,
      (err) => {
        if (err) {
          reject(`Error creating table: ${err.message}`)
        } else {
          resolve()
        }
      }
    )
  })

  const hashedPassword = await bcrypt.hash("testadmin123", 10)

  /* ---------------------------- Create test admin --------------------------- */
  await new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO users (username, password, idCard, name, role, status) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      ["admin", hashedPassword, "000000", "Test Admin", "admin", "active"],
      (err) => {
        if (err) {
          reject(`Error inserting admin user: ${err.message}`)
        } else {
          resolve()
        }
      }
    )
  })

  return db
}

export default initializeTestDatabase
