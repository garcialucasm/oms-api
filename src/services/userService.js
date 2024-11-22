import sqlite3 from "sqlite3"
import bcrypt from "bcrypt"
import {} from "dotenv/config"


const saltRounds = parseInt(process.env.SALT_ROUNDS)
const db = new sqlite3.Database("database.db")

class UserService {
    async checkExists(username, idCard) {
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

    async fetchUserByUsername(username) {
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
      

      async comparePasswords(password, hashedPassword) {
        return bcrypt.compare(password, hashedPassword)
      }
      
      async hashPassword(password) {
        return await bcrypt.hash(password, saltRounds)
      }
      
      async saveUser (username, password, idCard, name, role, status) {
        const hashedPassword = await this.hashPassword(password)
        return new Promise((resolve, reject) => {
        db.run(
          "INSERT INTO users (username, password, idCard, name, role, status) VALUES (?, ?, ?, ?, ?, ?)",
          [username, hashedPassword, idCard, name, role, status],
          function (err) {
            if (err) {
              reject(err);
            } else {
              resolve({ message: "User saved successfully", id: this.lastID });
            }
          }
        );
      });
      }
      
      async markInactive(username) {
        return new Promise((resolve, reject) => {
          db.run(
            "UPDATE users SET status = ? WHERE username = ?",
            ["inactive", username],
            function (err) {
              if (err) {
                reject(err)
              } else {
                resolve({
                  message: "User status updated to inactive"
                })
              }
            }
          )
        })
      }

      async updateUser(username, updates) {
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
              resolve({ message: "User updated successfully"})
            }
          })
        })}
      
}

export default new UserService()