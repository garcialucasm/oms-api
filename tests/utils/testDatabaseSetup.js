import sqlite3 from "sqlite3"
import bcrypt from "bcrypt"
import fs from "fs"
import path from "path"

import logger from "../../src/logger.js"

const initializeTestDatabase = async () => {
  const dbPath = path.resolve(process.env.DB_SQLITE_TEST)
  const saltRounds = parseInt(process.env.SALT_ROUNDS, 10) || 10

  /* ------------------------- Create sqlite database ------------------------- */
  const db = new sqlite3.Database(
    dbPath,
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE
  )

  /* ---------------- Check if 'users' table exists and drop it ---------------- */
  await new Promise((resolve, reject) => {
    db.get(
      `SELECT name FROM sqlite_master WHERE type='table' AND name='users';`,
      (err, row) => {
        if (err) {
          logger.error("Error checking for 'users' table: ", err.message)
          reject(`Error checking for 'users' table: ${err.message}`)
        } else if (row) {
          db.run(`DROP TABLE IF EXISTS users;`, (err) => {
            if (err) {
              logger.error("Error dropping 'users' table: ", err.message)
              reject(`Error dropping 'users' table: ${err.message}`)
            } else {
              logger.info("'users' table dropped.")
              resolve()
            }
          })
        } else {
          resolve()
        }
      }
    )
  })

  /* -------------------------- Force file creation -------------------------- */
  await new Promise((resolve, reject) => {
    db.run("PRAGMA user_version = 1;", (err) => {
      if (err) {
        logger.error("Error initializing database file: ", err.message)
        reject(`Error initializing database file: ${err.message}`)
      } else {
        resolve()
      }
    })
  })

  /* ------------------ Set permissions to full access ------------------ */
  if (fs.existsSync(dbPath)) {
    try {
      fs.chmodSync(dbPath, 0o666)
      logger.info(`Permissions for ${dbPath} set to 666.`)
    } catch (err) {
      logger.error("Error setting permissions to full access: ", err.message)
    }
  } else {
    logger.error(`Database file not found at ${dbPath}`)
  }

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

  const hashedPasswordAdmin = await bcrypt.hash("admin123", saltRounds)
  const hashedPasswordEmployee = await bcrypt.hash("employee123", saltRounds)

  /* ------------------------- Insert test admin ------------------------- */
  await new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO users (username, password, idCard, name, role, status) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        "admin_test",
        hashedPasswordAdmin,
        "000000",
        "Test Admin",
        "admin",
        "active",
      ],
      (err) => {
        if (err) {
          logger.error("Error inserting admin_test user: ", err.message)
          reject(`Error inserting admin_test user: ${err.message}`)
        } else {
          resolve()
        }
      }
    )
  })

  /* ------------------------- Insert test employee ------------------------- */
  await new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO users (username, password, idCard, name, role, status) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        "employee_test",
        hashedPasswordEmployee,
        "000000",
        "Test Employee",
        "employee",
        "active",
      ],
      (err) => {
        if (err) {
          logger.error("Error inserting employee_test user: ", err.message)
          reject(`Error inserting employee_test user: ${err.message}`)
        } else {
          resolve()
        }
      }
    )
  })

  /* ---------------------- Insert test inactive employee --------------------- */
  await new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO users (username, password, idCard, name, role, status) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        "employee_test_inactive",
        hashedPasswordEmployee,
        "000000",
        "Test Employee Inactive",
        "employee",
        "inactive",
      ],
      (err) => {
        if (err) {
          logger.error(
            "Error inserting employee_test_inactive user: ",
            err.message
          )
          reject(`Error inserting employee_test_inactive user: ${err.message}`)
        } else {
          resolve()
        }
      }
    )
  })

  return db
}

export default initializeTestDatabase
