import mongoose from "mongoose"
import dotenv from "dotenv"
import request from "supertest"

import { app, server } from "../src/app.js"
import { MESSAGES } from "../src/utils/responseMessages.js"

dotenv.config()

describe("Country API Tests", () => {
  let zone

  beforeAll(async () => {
    await mongoose.connect(process.env.DB_TEST_CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    /* ------------------------- Create a new zone first ------------------------ */
    const newZone = { cz: "A2", name: "ZonaA2" }
    const zoneResponse = await request(app).post("/api/zones").send(newZone)
    expect(zoneResponse.status).toBe(201)
    zone = zoneResponse.body.data.cz
    /* -------------------------------------------------------------------------- */
  })

  afterAll(async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
    server.close()
  })

  describe("POST /api/countries", () => {
    test("should create a new country", async () => {
      const newCountry = { name: "Portugal", zone }

      const countryResponse = await request(app)
        .post("/api/countries")
        .send(newCountry)
      expect(countryResponse.status).toBe(201)
      expect(countryResponse.body.data.cc).toBe("PT")
      expect(countryResponse.body.data.name).toBe("PORTUGAL")
    })

    test("should not create an already existing country name", async () => {
      const newCountry = { name: "Brazil", zone }

      const firstResponse = await request(app)
        .post("/api/countries")
        .send(newCountry)
      expect(firstResponse.status).toBe(201)
      expect(firstResponse.body.data.cc).toBe("BR")
      expect(firstResponse.body.data.name).toBe("BRAZIL")

      const secondResponse = await request(app)
        .post("/api/countries")
        .send(newCountry)
      expect(secondResponse.status).toBe(400)
      expect(secondResponse.body.message).toBe(MESSAGES.DUPLICATE_COUNTRY)
    })

    test("should not create a country with incorrect name", async () => {
      const newCountry = { name: "Espanha", zone }

      const response = await request(app)
        .post("/api/countries")
        .send(newCountry)
      expect(response.status).toBe(400)
      expect(response.body.error).toBe(MESSAGES.INVALID_COUNTRY_NAME)
    })

    test("should return validation error for missing name field", async () => {
      const invalidCountry = { zone }

      const response = await request(app)
        .post("/api/countries")
        .send(invalidCountry)
      expect(response.status).toBe(400)
      expect(response.body.error).toBe(MESSAGES.INVALID_COUNTRY_NAME)
    })

    test("should return validation error for missing zone field", async () => {
      const invalidCountry = { name: "England" }

      const response = await request(app)
        .post("/api/countries")
        .send(invalidCountry)
      expect(response.status).toBe(400)
      expect(response.body.error).toBe(MESSAGES.ZONE_NOT_FOUND)
    })
  })

  describe("GET /api/countries", () => {
    test("should return all countries", async () => {
      const response = await request(app).get("/api/countries")

      expect(response.status).toBe(200)
      expect(Array.isArray(response.body.data)).toBe(true)
    })
  })

  describe("GET /api/countries/cc/:cc", () => {
    test("should retrieve a country by its code", async () => {
      const response = await request(app).get("/api/countries/cc/PT")

      expect(response.status).toBe(200)
      expect(response.body.data[0].cc).toBe("PT")
    })

    test("should return 404 if the country is not found", async () => {
      const response = await request(app).get("/api/countries/cc/ZZ")

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
        .send(updatedCountryData)

      expect(response.status).toBe(400)
    })
  })

  describe("DELETE /api/countries/cc/:cc", () => {
    test("should delete a country by its code", async () => {
      const response = await request(app).delete("/api/countries/cc/GR")

      expect(response.status).toBe(200)
      expect(response.body.message).toBe(MESSAGES.COUNTRY_DELETED)
    })

    test("should return 404 if the country is not found for deletion", async () => {
      const response = await request(app).delete("/api/countries/cc/ZZ")

      expect(response.status).toBe(404)
      expect(response.body.error).toBe(MESSAGES.COUNTRY_NOT_FOUND)
    })
  })
})
