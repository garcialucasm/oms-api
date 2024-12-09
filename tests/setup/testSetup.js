import mongoose from "mongoose"
import request from "supertest"

import initializeTestDatabase from "../utils/testDatabaseSetup.js"
import { app, server } from "../../src/app.js"
import logger from "../../src/logger.js"

const db = await initializeTestDatabase()
let adminToken = null
let employeeToken = null

beforeAll(async () => {
  /* ------------------------- Connect to the database ------------------------ */
  await mongoose.connect(process.env.DB_TEST_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  /* ---------------- Authenticate and save the token globally ---------------- */
  const adminUser = { username: "admin_test", password: "admin123" }
  const loginAdminResponse = await request(app)
    .post("/api/auth/login")
    .send(adminUser)

  expect(loginAdminResponse.status).toBe(200)
  adminToken = loginAdminResponse.body.userToken

  const employeeUser = { username: "employee_test", password: "employee123" }
  const loginEmployeeResponse = await request(app)
    .post("/api/auth/login")
    .send(employeeUser)

  expect(loginEmployeeResponse.status).toBe(200)
  employeeToken = loginEmployeeResponse.body.userToken

  /* ------------------------------ Start server ------------------------------ */
  if (!server.listening) {
    server.listen(3000, () => logger.debug("Server is running on port 3000"))
  }
})

afterAll(async () => {
  /* ------------------- Clean database and close the server ------------------ */
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
  if (server.listening) {
    server.close()
  }
  db.close()
})

export { adminToken, employeeToken }
