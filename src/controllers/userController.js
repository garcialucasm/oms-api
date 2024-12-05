import {} from "dotenv/config"
import jwt from "jsonwebtoken"
import UserService from "../services/userService.js"
import logger from "../logger.js"
import { MESSAGES } from "../utils/responseMessages.js"
import UserInputDTO from "../DTO/userInputDTO.js"

const secureKey = process.env.SECRET_KEY
class UserController {
  async register(req, res) {
    const { username, password, idCard, name, role } = req.body
    try {
      const inputDTO = new UserInputDTO(req.body)
      const user = await inputDTO.toUser()
      const exists = await UserService.checkExists(user.username, user.idCard)
      if (exists) {
        res.status(400).json({ error: MESSAGES.DUPLICATE_USERNAME_IDCARD })
      } else {
        try {
          await UserService.saveUser(user)
          res.status(201).json({ message: MESSAGES.USER_REGISTERED })
        } catch (err) {
          if (err.name === "ValidationError") {
            let errorMessage = "Validation Error: "
            for (const field in err.errors) {
              errorMessage += `${err.errors[field].message} `
            }
            res.status(400).json({ error: errorMessage.trim() })
          } else if (err.code === 11000) {
            res.status(400).json({
              error: MESSAGES.DUPLICATE_IDCARD,
            })
          }
        }
      }
    } catch (err) {
      logger.error("UserController - register: ", err.message)
      if (err.message === "MissingRequiredFields") {
        res.status(400).json({
          error: MESSAGES.MISSING_REQUIRED_FIELDS,
        })
      } else res.status(500).json({ error: MESSAGES.FAILED_REGISTER })
    }
  }

  async login(req, res) {
    const { username, password } = req.body
    try {
      const user = await UserService.fetchUserByUsername(username)
      if (user) {
        if (user.status !== "active") {
          res.status(401).json({ error: MESSAGES.INACTIVE_USER })
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

            const token = jwt.sign(authData, secureKey)

            res
              .status(200)
              .json({ message: MESSAGES.LOGIN_SUCCESS, userToken: token })
          } else {
            res.status(401).json({ error: MESSAGES.INVALID_LOGIN })
          }
        }
      } else {
        res.status(401).json({ error: MESSAGES.USER_NOT_FOUND })
      }
    } catch (error) {
      logger.error("UserController - login: ", error.message)
      res.status(500).json({ error: error })
    }
  }

  async markInactive(req, res) {
    const { username } = req.params
    try {
      await UserService.markInactive(username)
      res.status(200).json({ message: MESSAGES.SUCCESS_INACTIVE })
    } catch (error) {
      logger.error("UserController - markInactive: ", error.message)
      res.status(500).json({ error: MESSAGES.FAILED_INACTIVE })
    }
  }

  async markActive(req, res) {
    const { username } = req.params
    try {
      await UserService.markActive(username)
      res.status(200).json({ message: MESSAGES.SUCCESS_ACTIVE })
    } catch (error) {
      logger.error("UserController - markInactive: ", error.message)
      res.status(500).json({ error: MESSAGES.FAILED_ACTIVE })
    }
  }

  async updateUser(req, res) {
    const { username } = req.params
    const { password, idCard, name } = req.body
    try {
      await UserService.updateUser(username, {
        password,
        idCard,
        name,
      })
      res.status(200).json({ message: MESSAGES.SUCCESS_UPDATE_USER })
    } catch (error) {
      logger.error("UserController - updateUser: ", error.message)
      res.status(500).json({ error: MESSAGES.FAILED_UPDATE_USER })
    }
  }
}

export default new UserController()
