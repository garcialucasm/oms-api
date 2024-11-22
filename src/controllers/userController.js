import {} from "dotenv/config"
import sqlite3 from "sqlite3"
import { saveUser } from "../models/userModel.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const secureKey = process.env.DB_SECRET_KEY
const db = new sqlite3.Database("database.db")

class userController {
  async register(req, res) {
    const { username, password, idCard, name, role } = req.body

    try {
      const exists = await checkExists(username, idCard)
      if (exists) {
        res.status(400).json({ error: "Duplicate username or idCard." })
      } else {
        try {
          await saveUser(username, password, idCard, name, role, "active")
          res.status(201).json({ message: "User registered successfully!" })
        } catch (err) {
          if (err.name === "ValidationError") {
            let errorMessage = "Validation Error: "
            for (const field in err.errors) {
              errorMessage += `${err.errors[field].message} `
            }
            res.status(400).json({ error: errorMessage.trim() })
          } else if (err.code === 11000) {
            res.status(400).json({
              error: "Duplicate idCard. Please use a unique idCard number.",
            })
          } else {
            res.status(500).json({ error: "Error saving person", details: err })
          }
        }
      }
    } catch (error) {
      res.send("Error:", error)
    }
  }

  async login(req, res) {
    const { username, password } = req.body
    try {
      const user = await fetchUserByUsername(username)
      if (user) {
        if (user.status !== "active") {
          res.status(401).json({ error: "Could not login. Inactive user." })
        } else {
          const hashedPasswordFromDB = user.password

          const passwordsMatch = await comparePasswords(
            password,
            hashedPasswordFromDB
          )
          if (passwordsMatch) {
            const authData = {
              username: user.username,
              userRole: user.role,
              idCard: user.idCard,
              name: user.name,
            }

            const token = jwt.sign(authData, secureKey, {
              expiresIn: "1h",
            })

            res.status(200).json({ userToken: token })
          } else {
            res.status(401).json({ error: "Incorrect username or password" })
          }
        }
      } else {
        res.status(401).json({ error: "User not found" })
      }
    } catch (error) {
      res.status(500).json({ error: error })
    }
  }

  checkExists(username, idCard) {
    return new Promise((resolve, reject) => {
      db.get(
        "SELECT * FROM users WHERE username = ? OR idCard = ?",
        [username, idCard],
        (err, row) => {
          if (err) {
            reject(err)
          } else {
            resolve(!!row)
          }
        }
      )
    })
  }

  fetchUserByUsername = (username) => {
    return new Promise((resolve, reject) => {
      db.get(
        "SELECT * FROM users WHERE username = ?",
        [username],
        (err, row) => {
          if (err) {
            reject(err)
          } else {
            resolve(row)
          }
        }
      )
    })
  }

  comparePasswords = (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword)
  }
}

export default new userController()
