import mongoose from "mongoose"
import dotenv from "dotenv"
import request from "supertest"

import { app, server } from "../src/app.js"
import { MESSAGES } from "../src/utils/responseMessages.js"
import initializeTestDatabase from "./testDatabaseSetup.js"

dotenv.config()

let db
let zone
let authToken

describe("Country API Tests with Authentication", () => {
  beforeAll(async () => {
    /* ---------- Initialize the in-memory SQLite database for testing ---------- */
    db = await initializeTestDatabase()

    /* ------------------ Connect to the test MongoDB database ------------------ */
    await mongoose.connect(process.env.DB_TEST_CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    /* ---------- Create an admin user and get the authentication token --------- */
    const adminUser = { username: "admin", password: "testadmin123" }

    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send(adminUser)
    expect(loginResponse.status).toBe(200)
    authToken = loginResponse.body.userToken

    /* ---------------------- Create a new zone for testing --------------------- */
    const newZone = { cz: "A2", name: "ZonaA2" }
    const zoneResponse = await request(app)
      .post("/api/zones")
      .set("Authorization", `Bearer ${authToken}`)
      .send(newZone)
    expect(zoneResponse.status).toBe(201)
    zone = zoneResponse.body.data.cz
  })

  afterAll(async () => {
    /* --------------- Clean up the database and close connections -------------- */
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
    server.close()
    db.close((err) => {
      if (err) {
        console.error("Error closing the database:", err)
      }
    })
  })

  describe("POST /api/countries", () => {
    test("should not create a new country without authentication", async () => {
      const newCountry = { name: "Portugal", zone }

      const countryResponse = await request(app)
        .post("/api/countries")
        .send(newCountry)
      expect(countryResponse.status).toBe(403)
      expect(countryResponse.body.error).toBe(MESSAGES.AUTH_REQUIRED)
    })

    test("should create a new country", async () => {
      const newCountry = { name: "Portugal", zone }

      const countryResponse = await request(app)
        .post("/api/countries")
        .set("Authorization", `Bearer ${authToken}`)
        .send(newCountry)
      expect(countryResponse.status).toBe(201)
      expect(countryResponse.body.data.cc).toBe("PT")
      expect(countryResponse.body.data.name).toBe("PORTUGAL")
    })

    test("should not create an already existing country name", async () => {
      const newCountry = { name: "Brazil", zone }

      const firstResponse = await request(app)
        .post("/api/countries")
        .set("Authorization", `Bearer ${authToken}`)
        .send(newCountry)
      expect(firstResponse.status).toBe(201)
      expect(firstResponse.body.data.cc).toBe("BR")
      expect(firstResponse.body.data.name).toBe("BRAZIL")

      const secondResponse = await request(app)
        .post("/api/countries")
        .set("Authorization", `Bearer ${authToken}`)
        .send(newCountry)
      expect(secondResponse.status).toBe(400)
      expect(secondResponse.body.message).toBe(MESSAGES.DUPLICATE_COUNTRY)
    })

    test("should not create a country with incorrect name", async () => {
      const newCountry = { name: "Espanha", zone }

      const response = await request(app)
        .post("/api/countries")
        .set("Authorization", `Bearer ${authToken}`)
        .send(newCountry)
      expect(response.status).toBe(400)
      expect(response.body.error).toBe(MESSAGES.INVALID_COUNTRY_NAME)
    })

    test("should return validation error for missing name field", async () => {
      const invalidCountry = { zone }

      const response = await request(app)
        .post("/api/countries")
        .set("Authorization", `Bearer ${authToken}`)
        .send(invalidCountry)
      expect(response.status).toBe(400)
      expect(response.body.error).toBe(MESSAGES.INVALID_COUNTRY_NAME)
    })

    test("should return validation error for missing zone field", async () => {
      const invalidCountry = { name: "England" }

      const response = await request(app)
        .post("/api/countries")
        .set("Authorization", `Bearer ${authToken}`)
        .send(invalidCountry)
      expect(response.status).toBe(400)
      expect(response.body.error).toBe(MESSAGES.ZONE_NOT_FOUND)
    })
  })

  describe("GET /api/countries", () => {
    test("should return all countries", async () => {
      const response = await request(app)
        .get("/api/countries")
        .set("Authorization", `Bearer ${authToken}`)

      expect(response.status).toBe(200)
      expect(Array.isArray(response.body.data)).toBe(true)
    })
  })

  describe("GET /api/countries/cc/:cc", () => {
    test("should retrieve a country by its code", async () => {
      const response = await request(app)
        .get("/api/countries/cc/PT")
        .set("Authorization", `Bearer ${authToken}`)

      expect(response.status).toBe(200)
      expect(response.body.data[0].cc).toBe("PT")
    })

    test("should return 404 if the country is not found", async () => {
      const response = await request(app)
        .get("/api/countries/cc/ZZ")
        .set("Authorization", `Bearer ${authToken}`)

      expect(response.status).toBe(404)
      expect(response.body.error).toBe(MESSAGES.COUNTRY_NOT_FOUND)
    })
  })

  describe("PUT /api/countries/:cc", () => {
    test("should update an existing country", async () => {
      const updatedCountryData = {
        name: "Greece",
        zone: zone,
      }

      const response = await request(app)
        .put("/api/countries/cc/PT")
        .set("Authorization", `Bearer ${authToken}`)
        .send(updatedCountryData)

      expect(response.status).toBe(200)
      expect(response.body.message).toBe(MESSAGES.COUNTRY_UPDATED)
      expect(response.body.data[0].name).toBe("GREECE")
      expect(response.body.data[0].cc).toBe("GR")
    })

    test("should return 400 when updating with invalid zone", async () => {
      const updatedCountryData = {
        name: "Portugal",
        zone: "InvalidZoneCode",
      }

      const response = await request(app)
        .put("/api/countries/cc/PT")
        .set("Authorization", `Bearer ${authToken}`)
        .send(updatedCountryData)

      expect(response.status).toBe(400)
      expect(response.body.error).toBe(MESSAGES.ZONE_NOT_FOUND)
    })

    test("should return 400 when updating with invalid country name", async () => {
      const updatedCountryData = {
        name: "InvalidCountryName",
        zone: zone,
      }

      const response = await request(app)
        .put("/api/countries/cc/GR")
        .set("Authorization", `Bearer ${authToken}`)
        .send(updatedCountryData)

      expect(response.status).toBe(400)
    })

    test("should not update a country without authentication", async () => {
      const toUpdateCountryData = {
        name: "Canada",
        zone: zone,
      }

      const response = await request(app)
        .put("/api/countries/cc/GR")
        .send(toUpdateCountryData)

      expect(response.status).toBe(403)
      expect(response.body.error).toBe(MESSAGES.AUTH_REQUIRED)
    })
  })

  describe("DELETE /api/countries/cc/:cc", () => {
    test("should delete a country by its code", async () => {
      const response = await request(app)
        .delete("/api/countries/cc/GR")
        .set("Authorization", `Bearer ${authToken}`)

      expect(response.status).toBe(200)
      expect(response.body.message).toBe(MESSAGES.COUNTRY_DELETED)
    })

    test("should return 404 if the country is not found for deletion", async () => {
      const response = await request(app)
        .delete("/api/countries/cc/ZZ")
        .set("Authorization", `Bearer ${authToken}`)

      expect(response.status).toBe(404)
      expect(response.body.error).toBe(MESSAGES.COUNTRY_NOT_FOUND)
    })

    test("should not delete a country without authentication", async () => {
      const response = await request(app).delete("/api/countries/cc/ZZ")

      expect(response.status).toBe(403)
      expect(response.body.error).toBe(MESSAGES.AUTH_REQUIRED)
    })
  })
})
