import sqlite3 from "sqlite3"
import bcrypt from "bcrypt"

const db = new sqlite3.Database("database.db")

const UserSchema = {
  username: String,
  password: String,
  idCard: String,
  name: String,
  role: String,
  status: String,
}

const hashPassword = async (password) => {
  const saltRounds = 10
  return await bcrypt.hash(password, saltRounds)
}

const saveUser = async (username, password, idCard, name, role, status) => {
  const hashedPassword = await hashPassword(password)
  db.run(
    "INSERT INTO users (username, password, idCard, name, role, status) VALUES (?, ?, ?, ?, ?, ?)",
    [username, hashedPassword, idCard, name, role, status]
  )
}

const markInactive = async (username) => {
  return new Promise((resolve, reject) => {
    db.run(
      "UPDATE users SET status = ? WHERE username = ?",
      ["inactive", username],
      function (err) {
        if (err) {
          reject(err)
        } else {
          resolve({
            message: "User status updated to inactive",
            changes: this.changes,
          })
        }
      }
    )
  })
}

const updateUser = async (username, updates) => {
  const { password, idCard, name } = updates

  let hashedPassword
  if (password) {
    hashedPassword = await hashPassword(password)
  }

  return new Promise((resolve, reject) => {
    const queryParts = []
    const params = []

    if (password) {
      queryParts.push("password = ?")
      params.push(hashedPassword)
    }
    if (idCard) {
      queryParts.push("idCard = ?")
      params.push(idCard)
    }
    if (name) {
      queryParts.push("name = ?")
      params.push(name)
    }

    const query = `UPDATE users SET ${queryParts.join(", ")} WHERE username = ?`
    params.push(username)

    db.run(query, params, function (err) {
      if (err) {
        reject(err)
      } else {
        resolve({ message: "User updated successfully", changes: this.changes })
      }
    })
  })
}

export { UserSchema, saveUser, markInactive, updateUser }
