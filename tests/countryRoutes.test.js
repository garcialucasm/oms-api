import dotenv from "dotenv"
import request from "supertest"
import mongoose from "mongoose"

import { app, server } from "../src/app.js"
import logger from "../src/logger.js"

dotenv.config()

describe("Country API Tests", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.DB_CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
  })

  afterAll(async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
    server.close()
  })

  describe("POST /api/countries", () => {
    it("should create a new country", async () => {
      const newCountry = { cc: "PT", name: "Portugal" }

      const response = await request(app)
        .post("/api/countries")
        .send(newCountry)

      expect(response.status).toBe(201)
      expect(response.body.data.cc).toBe("PT")
      expect(response.body.data.name).toBe("Portugal")
    })

    it("should not create an already existing country", async () => {
      const newCountry = { cc: "ES", name: "Spain" }

      const firstResponse = await request(app)
        .post("/api/countries")
        .send(newCountry)

      expect(firstResponse.status).toBe(201)
      expect(firstResponse.body.data.cc).toBe("ES")
      expect(firstResponse.body.data.name).toBe("Spain")

      const secondResponse = await request(app)
        .post("/api/countries")
        .send(newCountry)

      expect(secondResponse.status).toBe(400)
      expect(secondResponse.body.message).toBe(
        "Duplicate country code or country name. Please use unique values."
      )
    })

    it("should return validation error for missing name field", async () => {
      const invalidCountry = { cc: "PT" }

      const response = await request(app)
        .post("/api/countries")
        .send(invalidCountry)

      expect(response.status).toBe(400)
      expect(response.body.message).toContain("Country name is required")
    })

    it("should return validation error for missing cc field", async () => {
      const invalidCountry = { name: "Portugal" }

      const response = await request(app)
        .post("/api/countries")
        .send(invalidCountry)

      expect(response.status).toBe(400)
      expect(response.body.message).toContain("Country code is required")
    })
  })

  describe("GET /api/countries", () => {
    it("should return all countries", async () => {
      const response = await request(app).get("/api/countries")

      expect(response.status).toBe(200)
      expect(Array.isArray(response.body.data)).toBe(true)
    })
  })

  describe("GET /api/countries/cc/:cc", () => {
    it("should retrieve a country by its code", async () => {
      const response = await request(app).get("/api/countries/cc/PT")

      expect(response.status).toBe(200)
      expect(response.body.data[0].cc).toBe("PT")
    })

    it("should return 404 if the country is not found", async () => {
      const response = await request(app).get("/api/countries/cc/ZZ")

      expect(response.status).toBe(404)
    })
  })

  describe("DELETE /api/countries/cc/:cc", () => {
    it("should delete a country by its code", async () => {
      const response = await request(app).delete("/api/countries/cc/PT")

      expect(response.status).toBe(200)
      expect(response.body.message).toContain("Country deleted successfully")
    })

    it("should return 404 if the country is not found for deletion", async () => {
      const response = await request(app).delete("/api/countries/cc/ZZ")

      expect(response.status).toBe(404)
    })
  })
})
