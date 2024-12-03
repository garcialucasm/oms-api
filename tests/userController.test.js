import request from "supertest"

import { MESSAGES } from "../src/utils/responseMessages.js"
import { app } from "../src/app.js"

// TODO: Delete the const adminToken and import from testSetup after the auth implementation
const adminToken = ""
import { adminToken } from "./setup/testSetup.js"

describe("User API Tests with Authentication", () => {
const adminUsername = "admin@e.com"
const adminPassword = "1234"
const employeeUsername = "employeeNumberOne"
const employeePassword = "1234"

  test("should create a new admin", async () => {
    const newAdmin = {
      username: adminUsername,
      password: adminPassword,
      name: "XXX",
      idCard:"ABC123",
      role:"admin"
    }

    const adminResponse = await request(app)
      .post("/api/auth/register")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(newAdmin)
    expect(adminResponse.status).toBe(201)
  })

  test("should login as admin", async () => {
    const adminLogin = {
      username: adminUsername,
      password: adminPassword,
    }

    const response = await request(app)
      .post("/api/auth/login")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(adminLogin)
    expect(response.status).toBe(200)
  })

  test("should create a new employee", async () => {
    const newEmployee = {
      username: employeeUsername,
      password: employeePassword,
      name: "YYY",
      idCard: "AAA111",
      role: "employee"
    }

    const response = await request(app)
      .post("/api/auth/register/employee")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(newEmployee)
    expect(response.status).toBe(201)
  })

  test("should login as employee", async () => {
    const employeeLogin = {
      username: employeeUsername,
      password: employeePassword,
    }

    const response = await request(app)
      .post("/api/auth/login")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(employeeLogin)
    expect(response.status).toBe(200)
  })

  test("should fail to create a new user for missing required fields", async () => {
    const newUser = {
      username: "newinvaliduser",
      password: "1234",
    }

    const response = await request(app)
      .post("/api/auth/register/client")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(newUser)
    expect(response.status).toBe(400)
    expect(response.body.error).toBe(MESSAGES.MISSING_REQUIRED_FIELDS)
  })

  test("should turn a user status into 'inactive'", async () => {
    const response = await request(app)
      .delete(`/api/auth/${employeeUsername}`)
      .set("Authorization", `Bearer ${adminToken}`)
    expect(response.status).toBe(200)
  })

  test("should fail login for inactive status", async () => {
    const employeeLogin = {
      username: employeeUsername,
      password: employeePassword,
    }

    const response = await request(app)
      .post("/api/auth/login")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(employeeLogin)
    expect(response.status).toBe(401)
    expect(response.body.error).toBe(MESSAGES.INACTIVE_USER)
  })

  test("should succeed to turn user status into 'active'", async () => {
    const response = await request(app)
      .put(`/api/auth/activate/${employeeUsername}`)
      .set("Authorization", `Bearer ${adminToken}`)
    expect(response.status).toBe(200)
  })

  test("should login as client (after activate)", async () => {
    const employeeLogin = {
      username: employeeUsername,
      password: employeePassword,
    }

    const response = await request(app)
      .post("/api/auth/login")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(employeeLogin)
    expect(response.status).toBe(200)
  })

  test("should fail login for wrong username or password", async () => {
    const employeeLogin = {
      username: employeeUsername,
      password: "123456789",
    }

    const response = await request(app)
      .post("/api/auth/login")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(employeeLogin)
    expect(response.status).toBe(401)
    expect(response.body.error).toBe(MESSAGES.INVALID_LOGIN)
  })

  test("should fail login for unregistered user", async () => {
    const employeeLogin = {
      username: "inexistenemployee",
      password: "1234",
    }

    const response = await request(app)
      .post("/api/auth/login")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(employeeLogin)
    expect(response.status).toBe(401)
    expect(response.body.error).toBe(MESSAGES.USER_NOT_FOUND)
  })

  test("should update a user", async () => {
    const employeeUpdate = {
      username: employeeUsername,
      password: employeePassword,
      name: "CCC",
      idCard:"222333",
      role:"employee"
    }

    const response = await request(app)
      .put("/api/auth/update/client@e.com")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(employeeUpdate)
    expect(response.status).toBe(200)
  })
})
