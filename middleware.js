import jwt from "jsonwebtoken"
const secureKey = process.env.SECRET_KEY

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]

  //Deixar utilizadores nao autenticados fazerem GET apenas
  if (!token) {
    if (req.baseUrl === "/api/auth/register") {
      return res.status(403).json({ error: "Access denied for this route" })
    }
    else if (req.method === "GET") {
      return next()
    } else {
      return res
        .status(403)
        .json({ error: "Authentication required for this action" })
    }
  }

  jwt.verify(token, secureKey, (err, decodedUser) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" })
    }
      //Os Admins podem fazer tudo, entao nao precisam de nenhuma verificaçao adicional
    if (decodedUser.userRole === "admin") {
      return next()
    } //Limitar os employees a GET em zones e countries, bloquear açoes de deletes em tudo, permitir as restantes
    if (decodedUser.userRole === "employee") {
      if (req.baseUrl === "/api/auth/register") {
        return res.status(403).json({ error: "Access denied for this route" })
      }
      if (req.baseUrl === "/api/zones" || req.baseUrl === "/api/countries") {
        if (req.method !== "GET") {
          return res.status(403).json({ error: "Access denied for this route" })
        } else {
          return next()
        }
      } else if (req.method === "DELETE") {
        return res.status(403).json({ error: "Access denied for this route" })
      } 
    } else {
      return next()
    }
  })
}

export default verifyToken