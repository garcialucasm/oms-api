import request from "supertest"

import { MESSAGES } from "../src/utils/responseMessages.js"
import { app } from "../src/app.js"

import { adminToken, employeeToken } from "./setup/testSetup.js"

describe("User API Tests with Authentication", () => {
  const adminUsername = "admin_test"
  const adminPassword = "admin123"
  const employeeUsername = "employee_test"
  const employeePassword = "employee123"
  const employeeInactiveUsername = "employee_test_inactive"
  const employeeInactivePassword = "employee123"

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

  test("should login as employee", async () => {
    const employeeLogin = {
      username: employeeUsername,
      password: employeePassword,
    }

    const response = await request(app)
      .post("/api/auth/login")
      .send(employeeLogin)
    expect(response.status).toBe(200)
  })

  test("should fail login for inactive status", async () => {
    const employeeLogin = {
      username: employeeInactiveUsername,
      password: employeeInactivePassword,
    }

    const response = await request(app)
      .post("/api/auth/login")
      .send(employeeLogin)
    expect(response.status).toBe(401)
    expect(response.body.error).toBe(MESSAGES.INACTIVE_USER)
  })

  test("should login as client (after activate)", async () => {
    const employeeLogin = {
      username: employeeUsername,
      password: employeePassword,
    }

    const response = await request(app)
      .post("/api/auth/login")
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
      .send(employeeLogin)
    expect(response.status).toBe(401)
    expect(response.body.error).toBe(MESSAGES.USER_NOT_FOUND)
  })

  test("should create a new admin", async () => {
    const newAdmin = {
      username: "new_admin",
      password: "1234",
      name: "XXX",
      idCard: "ABC123",
      role: "admin",
    }

    const adminResponse = await request(app)
      .post("/api/auth/register")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(newAdmin)
    expect(adminResponse.status).toBe(201)
  })

  test("should create a new employee", async () => {
    const newEmployee = {
      username: "new_employee",
      password: "1234",
      name: "YYY",
      idCard: "AAA111",
      role: "employee",
    }

    const response = await request(app)
      .post("/api/auth/register")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(newEmployee)
    expect(response.status).toBe(201)
  })

  test("should fail to create a new user for missing required fields", async () => {
    const newUser = {
      username: "newinvaliduser",
      password: "1234",
    }

    const response = await request(app)
      .post("/api/auth/register")
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

  test("should succeed to turn user status into 'active'", async () => {
    const response = await request(app)
      .put(`/api/auth/activate/${employeeUsername}`)
      .set("Authorization", `Bearer ${adminToken}`)
    expect(response.status).toBe(200)
  })

  test("should update a user", async () => {
    const employeeUpdate = {
      username: employeeUsername,
      password: employeePassword,
      name: "CCC",
      idCard: "222333",
      role: "employee",
    }

    const response = await request(app)
      .put(`/api/auth/update/${employeeUpdate.username}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send(employeeUpdate)
    expect(response.status).toBe(200)
  })
})
