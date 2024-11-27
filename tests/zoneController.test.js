import mongoose from "mongoose"
import dotenv from "dotenv"
import request from "supertest"

import { app, server } from "../src/app.js"
import { MESSAGES } from "../src/utils/responseMessages.js"
import { adminToken } from "./setup/testSetup.js"

dotenv.config()

describe("Zone API Tests with Authentication", () => {
  describe("POST /api/zones", () => {
    test("should create a new zone", async () => {
      const newZone = { cz: "Z1", name: "ZoneTest1" }

      const response = await request(app)
        .post("/api/zones")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(newZone)
      expect(response.status).toBe(201)
      expect(response.body.data.cz).toBe("Z1")
      expect(response.body.data.name).toBe("ZoneTest1")
    })

    test("should not create a duplicate zone code or name", async () => {
      const newZone = { cz: "Z2", name: "DuplicateZoneTest" }

      const firstResponse = await request(app)
        .post("/api/zones")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(newZone)
      expect(firstResponse.status).toBe(201)

      const secondResponse = await request(app)
        .post("/api/zones")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(newZone)
      expect(secondResponse.status).toBe(400)
      expect(secondResponse.body.error).toBe(MESSAGES.DUPLICATE_ZONE)
    })

    test("should return validation error for invalid zone code", async () => {
      const invalidZone = { cz: "1Z", name: "InvalidZone" }

      const response = await request(app)
        .post("/api/zones")
        .set("Authorization", `Bearer ${adminToken}`)
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
        .set("Authorization", `Bearer ${adminToken}`)
        .send(invalidZone)
      expect(response.status).toBe(400)
      expect(response.body.error).toBe(MESSAGES.MISSING_REQUIRED_FIELDS)
    })
  })

  describe("GET /api/zones", () => {
    test("should return all zones", async () => {
      const response = await request(app)
        .get("/api/zones")
        .set("Authorization", `Bearer ${adminToken}`)

      expect(response.status).toBe(200)
      expect(Array.isArray(response.body.data)).toBe(true)
    })
  })

  describe("GET /api/zones/name/:name", () => {
    test("should retrieve a zone by its name", async () => {
      const response = await request(app)
        .get("/api/zones/name/ZoneTest1")
        .set("Authorization", `Bearer ${adminToken}`)

      expect(response.status).toBe(200)
      expect(response.body.data.name).toBe("ZoneTest1")
    })

    test("should return 404 if the zone is not found by name", async () => {
      const response = await request(app)
        .get("/api/zones/name/UnknownZone")
        .set("Authorization", `Bearer ${adminToken}`)

      expect(response.status).toBe(404)
      expect(response.body.error).toBe(MESSAGES.ZONE_NOT_FOUND_BY_NAME)
    })
  })

  describe("GET /api/zones/cz/:cz", () => {
    test("should retrieve a zone by its code", async () => {
      const response = await request(app)
        .get("/api/zones/cz/Z1")
        .set("Authorization", `Bearer ${adminToken}`)

      expect(response.status).toBe(200)
      expect(response.body.data.cz).toBe("Z1")
    })

    test("should return 404 if the zone is not found by code", async () => {
      const response = await request(app)
        .get("/api/zones/cz/U0")
        .set("Authorization", `Bearer ${adminToken}`)

      expect(response.status).toBe(404)
      expect(response.body.error).toBe(MESSAGES.ZONE_NOT_FOUND_BY_CODE)
    })
  })

  describe("PUT /api/zones/:cz", () => {
    test("should update an existing zone", async () => {
      const updatedZoneData = { name: "UpdatedZoneTest1", cz: "Z1" }

      const response = await request(app)
        .put("/api/zones/Z1")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updatedZoneData)

      expect(response.status).toBe(201)
      expect(response.body.data.name).toBe("UpdatedZoneTest1")
    })

    test("should return 400 if zone to update is not found", async () => {
      const updatedZoneData = { name: "NonExistentZone", cz: "N1" }

      const response = await request(app)
        .put("/api/zones/N0")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updatedZoneData)

      expect(response.status).toBe(400)
      expect(response.body.error).toBe(MESSAGES.ZONE_NOT_FOUND_BY_CODE)
    })
  })

  describe("DELETE /api/zones/:cz", () => {
    test("should delete a zone by its code", async () => {
      const response = await request(app)
        .delete("/api/zones/Z1")
        .set("Authorization", `Bearer ${adminToken}`)

      expect(response.status).toBe(200)
      expect(response.body.message).toBe(MESSAGES.ZONE_DELETED)
    })

    test("should return 400 if zone to delete is not found", async () => {
      const response = await request(app)
        .delete("/api/zones/N0")
        .set("Authorization", `Bearer ${adminToken}`)

      expect(response.status).toBe(400)
      expect(response.body.error).toBe(MESSAGES.ZONE_NOT_FOUND_BY_CODE)
    })

    test("should return 400 if zone to delete has countries associated", async () => {
      const newZone = { cz: "Z3", name: "ZoneTest3" }
      const zoneResponse = await request(app)
        .post("/api/zones")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(newZone)
      expect(zoneResponse.status).toBe(201)

      const newCountry = {
        cc: "PT",
        name: "Portugal",
        zone: "Z3",
      }
      const countryResponse = await request(app)
        .post("/api/countries")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(newCountry)
      expect(countryResponse.status).toBe(201)

      const response = await request(app)
        .delete("/api/zones/Z3")
        .set("Authorization", `Bearer ${adminToken}`)

      expect(response.status).toBe(400)
      expect(response.body.error).toBe(
        MESSAGES.CANNOT_DELETE_COUNTRIES_ASSOCIATED
      )
    })

    test("should return 400 if zone to delete has outbreaks associated", async () => {
      const newZone = { cz: "Z4", name: "ZoneTest4" }
      const zoneResponse = await request(app)
        .post("/api/zones")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(newZone)
      expect(zoneResponse.status).toBe(201)

      const newVirus = {
        cv: "VV11",
        name: "VirusTest1",
      }
      const virusResponse = await request(app)
        .post("/api/viruses")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(newVirus)
      expect(virusResponse.status).toBe(201)

      const newOutbreak = {
        co: "1O",
        zone: "Z4",
        virus: "VV11",
        startDate: "2024/10/10",
      }

      const outbreakResponse = await request(app)
        .post("/api/outbreaks")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(newOutbreak)
      expect(outbreakResponse.status).toBe(201)

      const response = await request(app)
        .delete("/api/zones/Z4")
        .set("Authorization", `Bearer ${adminToken}`)

      expect(response.status).toBe(400)
      expect(response.body.error).toBe(
        MESSAGES.CANNOT_DELETE_OUTBREAKS_ASSOCIATED
      )
    })
  })
})
