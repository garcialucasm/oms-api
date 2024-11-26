import mongoose from "mongoose"
import dotenv from "dotenv"
import request from "supertest"

import Country from "../src/models/countryModel.js"
import Virus from "../src/models/virusModel.js"
import Outbreak from "../src/models/outbreakModel.js"
import Zone from "../src/models/zoneModel.js"
import { app, server } from "../src/app.js"
import { MESSAGES } from "../src/utils/responseMessages.js"

dotenv.config()

/* let authToken */

describe("Zone API Tests with Authentication", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.DB_TEST_CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    /* const adminUser = { username: "admin", password: "testadmin123" } */

    /* const loginResponse = await request(app)
      .post("/api/auth/login")
      .send(adminUser)
    expect(loginResponse.status).toBe(200)
    authToken = loginResponse.body.userToken
  }) */
  })

  afterAll(async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
    server.close()
  })

  describe("POST /api/zones", () => {
    test("should create a new zone", async () => {
      const newZone = { cz: "Z1", name: "ZoneTest1" }

      const response = await request(app)
        .post("/api/zones")
        /* .set("Authorization", `Bearer ${authToken}`) */
        .send(newZone)
      expect(response.status).toBe(201)
      expect(response.body.data.cz).toBe("Z1")
      expect(response.body.data.name).toBe("ZoneTest1")
    })

    test("should not create a duplicate zone code or name", async () => {
      const newZone = { cz: "Z2", name: "DuplicateZoneTest" }

      const firstResponse = await request(app)
        .post("/api/zones")
        /* .set("Authorization", `Bearer ${authToken}`) */
        .send(newZone)
      expect(firstResponse.status).toBe(201)

      const secondResponse = await request(app)
        .post("/api/zones")
        /* .set("Authorization", `Bearer ${authToken}`) */
        .send(newZone)
      expect(secondResponse.status).toBe(400)
      expect(secondResponse.body.error).toBe(MESSAGES.DUPLICATE_ZONE)
    })

    test("should return validation error for invalid zone code", async () => {
      const invalidZone = { cz: "1Z", name: "InvalidZone" }

      const response = await request(app)
        .post("/api/zones")
        /* .set("Authorization", `Bearer ${authToken}`) */
        .send(invalidZone)
      expect(response.status).toBe(400)
      expect(response.body.error.message).toContain(
        "Zone code must have 1 letter and 1 number"
      )
    })

    test("should return validation error for missing fields", async () => {
      const invalidZone = { cz: "Z3" }

      const response = await request(app)
        .post("/api/zones")
        /* .set("Authorization", `Bearer ${authToken}`) */
        .send(invalidZone)
      expect(response.status).toBe(400)
      expect(response.body.error).toBe(MESSAGES.MISSING_REQUIRED_FIELDS)
    })
  })

  describe("GET /api/zones", () => {
    test("should return all zones", async () => {
      const response = await request(app).get("/api/zones")
      /* .set("Authorization", `Bearer ${authToken}`) */

      expect(response.status).toBe(200)
      expect(Array.isArray(response.body.data)).toBe(true)
    })
  })

  describe("GET /api/zones/name/:name", () => {
    test("should retrieve a zone by its name", async () => {
      const response = await request(app).get("/api/zones/name/ZoneTest1")
      /* .set("Authorization", `Bearer ${authToken}`) */

      expect(response.status).toBe(200)
      expect(response.body.data.name).toBe("ZoneTest1")
    })

    test("should return 404 if the zone is not found by name", async () => {
      const response = await request(app).get("/api/zones/name/UnknownZone")
      /* .set("Authorization", `Bearer ${authToken}`) */

      expect(response.status).toBe(404)
      expect(response.body.error).toBe(MESSAGES.ZONE_NOT_FOUND_BY_NAME)
    })
  })

  describe("GET /api/zones/cz/:cz", () => {
    test("should retrieve a zone by its code", async () => {
      const response = await request(app).get("/api/zones/cz/Z1")
      /* .set("Authorization", `Bearer ${authToken}`) */

      expect(response.status).toBe(200)
      expect(response.body.data.cz).toBe("Z1")
    })

    test("should return 404 if the zone is not found by code", async () => {
      const response = await request(app).get("/api/zones/cz/U0")
      /* .set("Authorization", `Bearer ${authToken}`) */

      expect(response.status).toBe(404)
      expect(response.body.error).toBe(MESSAGES.ZONE_NOT_FOUND_BY_CODE)
    })
  })

  describe("PUT /api/zones/:cz", () => {
    test("should update an existing zone", async () => {
      const updatedZoneData = { name: "UpdatedZoneTest1", cz: "Z1" }

      const response = await request(app)
        .put("/api/zones/Z1")
        /* .set("Authorization", `Bearer ${authToken}`) */
        .send(updatedZoneData)

      expect(response.status).toBe(201)
      expect(response.body.data.name).toBe("UpdatedZoneTest1")
    })

    test("should return 400 if zone to update is not found", async () => {
      const updatedZoneData = { name: "NonExistentZone", cz: "N1" }

      const response = await request(app)
        .put("/api/zones/N0")
        /* .set("Authorization", `Bearer ${authToken}`) */
        .send(updatedZoneData)

      expect(response.status).toBe(400)
      expect(response.body.error).toBe(MESSAGES.ZONE_NOT_FOUND_BY_CODE)
    })
  })

  describe("DELETE /api/zones/:cz", () => {
    test("should delete a zone by its code", async () => {
      const response = await request(app).delete("/api/zones/Z1")
      /* .set("Authorization", `Bearer ${authToken}`) */

      expect(response.status).toBe(200)
      expect(response.body.message).toBe(MESSAGES.ZONE_DELETED)
    })

    test("should return 400 if zone to delete is not found", async () => {
      const response = await request(app).delete("/api/zones/N0")
      /* .set("Authorization", `Bearer ${authToken}`) */

      expect(response.status).toBe(400)
      expect(response.body.error).toBe(MESSAGES.ZONE_NOT_FOUND_BY_CODE)
    })

    test("should return 400 if zone to delete has countries associated", async () => {
      const newZone = await Zone.create({ cz: "Z3", name: "ZoneTest3" })

      await Country.create({
        cc: "PT",
        name: "Portugal",
        zone: newZone._id,
      })

      const response = await request(app).delete("/api/zones/Z3")
      /* .set("Authorization", `Bearer ${authToken}`) */

      expect(response.status).toBe(400)
      expect(response.body.error).toBe(
        MESSAGES.CANNOT_DELETE_COUNTRIES_ASSOCIATED
      )
    })

    test("should return 400 if zone to delete has outbreaks associated", async () => {
      const newZone = await Zone.create({ cz: "Z4", name: "ZoneTest4" })
      
      const outbreakVirus = await Virus.create({ cv: "VV11", name: "VirusTest1" })

      await Outbreak.create({
        co: "1O",
        zone: newZone._id,
        virus: outbreakVirus._id,
        startDate: "2024/10/10",
      })
      const response = await request(app).delete("/api/zones/Z4")
      /* .set("Authorization", `Bearer ${authToken}`) */

      expect(response.status).toBe(400)
      expect(response.body.error).toBe(
        MESSAGES.CANNOT_DELETE_OUTBREAKS_ASSOCIATED
      )
    })
  })
})
