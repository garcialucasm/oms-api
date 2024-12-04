import request from "supertest"

import { MESSAGES } from "../src/utils/responseMessages.js"
import { adminToken, employeeToken } from "./setup/testSetup.js"
import { app } from "../src/app.js"

describe("Country API Tests with Authentication", () => {
  let zone

  beforeAll(async () => {
    /* ---------------------- Create a new zone for testing --------------------- */
    const newZone = { cz: "A2", name: "ZonaA2" }
    const zoneResponse = await request(app)
      .post("/api/zones")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(newZone)
    expect(zoneResponse.status).toBe(201)
    zone = zoneResponse.body.data.cz

    const newZone1 = { cz: "A3", name: "ZonaA3" }
    const zoneResponse1 = await request(app)
      .post("/api/zones")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(newZone1)
    expect(zoneResponse1.status).toBe(201)

    const newVirus = { cv: "VV11", name: "VirusTest1" }
    const virusResponse = await request(app)
      .post("/api/viruses")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(newVirus)
    expect(virusResponse.status).toBe(201)

    const newOutbreak = {
      co: "1O",
      zone: "A2",
      virus: "VV11",
      startDate: "2024/10/10",
    }
    const outbreakResponse = await request(app)
      .post("/api/outbreaks")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(newOutbreak)
    expect(outbreakResponse.status).toBe(201)
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
        .set("Authorization", `Bearer ${adminToken}`)
        .send(newCountry)
      expect(countryResponse.status).toBe(201)
      expect(countryResponse.body.data.cc).toBe("pt")
      expect(countryResponse.body.data.name).toBe("portugal")
    })

    test("should not create an already existing country name", async () => {
      const newCountry = { name: "Brazil", zone: "A3" }

      const firstResponse = await request(app)
        .post("/api/countries")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(newCountry)
      expect(firstResponse.status).toBe(201)
      expect(firstResponse.body.data.cc).toBe("br")
      expect(firstResponse.body.data.name).toBe("brazil")

      const secondResponse = await request(app)
        .post("/api/countries")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(newCountry)
      expect(secondResponse.status).toBe(400)
      expect(secondResponse.body.message).toBe(MESSAGES.DUPLICATE_COUNTRY)
    })

    test("should not create a country with incorrect name", async () => {
      const newCountry = { name: "Espanha", zone }

      const response = await request(app)
        .post("/api/countries")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(newCountry)
      expect(response.status).toBe(400)
      expect(response.body.error).toBe(MESSAGES.INVALID_COUNTRY_NAME)
    })

    test("should not create a country with employee logged in", async () => {
      const newCountry = { name: "Greece", zone }

      const response = await request(app)
        .post("/api/countries")
        .set("Authorization", `Bearer ${employeeToken}`)
        .send(newCountry)
      expect(response.status).toBe(403)
    })

    test("should return validation error for missing name field", async () => {
      const invalidCountry = { zone }

      const response = await request(app)
        .post("/api/countries")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(invalidCountry)
      expect(response.status).toBe(400)
      expect(response.body.error).toBe(MESSAGES.INVALID_COUNTRY_NAME)
    })

    test("should return validation error for missing zone field", async () => {
      const invalidCountry = { name: "England" }

      const response = await request(app)
        .post("/api/countries")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(invalidCountry)
      expect(response.status).toBe(400)
      expect(response.body.error).toBe(MESSAGES.ZONE_NOT_FOUND)
    })
  })

  describe("GET /api/countries", () => {
    test("should return all countries", async () => {
      const response = await request(app)
        .get("/api/countries")
        .set("Authorization", `Bearer ${adminToken}`)

      expect(response.status).toBe(200)
      expect(Array.isArray(response.body.data)).toBe(true)
    })

    test("should return all countries with employee logged in", async () => {
      const response = await request(app)
        .get("/api/countries")
        .set("Authorization", `Bearer ${employeeToken}`)

      expect(response.status).toBe(200)
      expect(Array.isArray(response.body.data)).toBe(true)
    })
  })

  describe("GET /api/countries/cc/:cc", () => {
    test("should retrieve a country by its code", async () => {
      const response = await request(app)
        .get("/api/countries/cc/PT")
        .set("Authorization", `Bearer ${adminToken}`)

      expect(response.status).toBe(200)
      expect(response.body.data[0].cc).toBe("pt")
    })

    test("should return 404 if the country is not found", async () => {
      const response = await request(app)
        .get("/api/countries/cc/ZZ")
        .set("Authorization", `Bearer ${adminToken}`)

      expect(response.status).toBe(404)
      expect(response.body.error).toBe(MESSAGES.COUNTRY_NOT_FOUND)
    })
  })

  describe("GET /api/countries/cc/info/:cc", () => {
    test("should retrieve all available information about outbreaks and guidelines given a country code", async () => {
      const response = await request(app)
        .get("/api/countries/cc/info/PT")
        .set("Authorization", `Bearer ${adminToken}`)
      expect(response.status).toBe(200)
      expect(Array.isArray(response.body.data)).toBe(true)
    })

    test("should return 400 for no country code match", async () => {
      const response = await request(app)
        .get("/api/countries/cc/info/FR")
        .set("Authorization", `Bearer ${adminToken}`)
      expect(response.status).toBe(400)
      expect(response.body.error).toBe(MESSAGES.COUNTRY_NOT_FOUND)
    })

    test("should return 404 for no outbreaks found", async () => {
      const response = await request(app)
        .get("/api/countries/cc/info/BR")
        .set("Authorization", `Bearer ${adminToken}`)
      expect(response.status).toBe(404)
      expect(response.body.error).toBe(MESSAGES.OUTBREAK_NOT_FOUND)
    })
  })

  describe("PUT /api/countries/:cc", () => {
    test("should fail to update an existing country with employee logged in", async () => {
      const updatedCountryData = {
        name: "Greece",
        zone: zone,
      }

      const response = await request(app)
        .put("/api/countries/cc/PT")
        .set("Authorization", `Bearer ${employeeToken}`)
        .send(updatedCountryData)

      expect(response.status).toBe(403)
    })

    test("should update an existing country", async () => {
      const updatedCountryData = {
        name: "Greece",
        zone: zone,
      }

      const response = await request(app)
        .put("/api/countries/cc/PT")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updatedCountryData)

      expect(response.status).toBe(200)
      expect(response.body.message).toBe(MESSAGES.COUNTRY_UPDATED)
      expect(response.body.data[0].name).toBe("greece")
      expect(response.body.data[0].cc).toBe("gr")
    })

    test("should return 400 when updating with invalid zone", async () => {
      const updatedCountryData = {
        name: "Portugal",
        zone: "InvalidZoneCode",
      }

      const response = await request(app)
        .put("/api/countries/cc/PT")
        .set("Authorization", `Bearer ${adminToken}`)
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
        .set("Authorization", `Bearer ${adminToken}`)
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
    test("should fail to delete a country by its code with employee logged in", async () => {
      const response = await request(app)
        .delete("/api/countries/cc/GR")
        .set("Authorization", `Bearer ${employeeToken}`)

      expect(response.status).toBe(403)
    })

    test("should delete a country by its code", async () => {
      const response = await request(app)
        .delete("/api/countries/cc/GR")
        .set("Authorization", `Bearer ${adminToken}`)

      expect(response.status).toBe(200)
      expect(response.body.message).toBe(MESSAGES.COUNTRY_DELETED)
    })

    test("should return 404 if the country is not found for deletion", async () => {
      const response = await request(app)
        .delete("/api/countries/cc/ZZ")
        .set("Authorization", `Bearer ${adminToken}`)

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
