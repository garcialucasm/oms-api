import {} from "dotenv/config"
import jwt from "jsonwebtoken"
import UserService from "../services/userService.js"

const secureKey = process.env.SECRET_KEY

class UserController {

  async register(req, res) {
    const { username, password, idCard, name, role } = req.body
    try {
      const exists = await UserService.checkExists(username, idCard)
      if (exists) {
        res.status(400).json({ error: "Duplicate username or idCard." })
      } else {
        try {
          await UserService.saveUser(username, password, idCard, name, role, "active")
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
      const user = await UserService.fetchUserByUsername(username)
      if (user) {
        if (user.status !== "active") {
          res.status(401).json({ error: "Could not login. Inactive user." })
        } else {
          const hashedPasswordFromDB = user.password
          const passwordsMatch = await UserService.comparePasswords(
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

  async markInactive(req, res) {
    const { username } = req.params;
    try {
      const result = await UserService.markInactive(username);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: "Error marking user as inactive." });
    }
  }

  async updateUser(req, res) {
    const { username } = req.params; 
    const { password, idCard, name } = req.body;
    try {
      const result = await UserService.updateUser(username, { password, idCard, name });
      res.status(200).json(result); 
    } catch (error) {
      res.status(500).json({ error: "Error updating user." });
    }
  }
}

export default new UserController()
