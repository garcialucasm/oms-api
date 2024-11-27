import request from "supertest"

import { adminToken } from "./setup/testSetup.js"
import { MESSAGES } from "../src/utils/responseMessages.js"
import { app } from "../src/app.js"

describe("Virus API Tests with Authentication", () => {
  describe("POST /api/viruses", () => {
    test("should create a new virus", async () => {
      const newVirus = { cv: "AB12", name: "Influenza" }
      const response = await request(app)
        .post("/api/viruses")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(newVirus)
      expect(response.status).toBe(201)
      expect(response.body.data.cv).toBe("AB12")
      expect(response.body.data.name).toBe("Influenza")
    })

    test("should not create a duplicate virus code", async () => {
      const newVirus = { cv: "CD34", name: "SARS" }

      const firstResponse = await request(app)
        .post("/api/viruses")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(newVirus)
      expect(firstResponse.status).toBe(201)

      const secondResponse = await request(app)
        .post("/api/viruses")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(newVirus)
      expect(secondResponse.status).toBe(400)
      expect(secondResponse.body.error).toBe(MESSAGES.DUPLICATE_VIRUS)
    })

    test("should return validation error for invalid virus code", async () => {
      const invalidVirus = { cv: "A123", name: "InvalidVirus" }

      const response = await request(app)
        .post("/api/viruses")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(invalidVirus)
      expect(response.status).toBe(400)
      expect(response.body.error.message).toContain(
        "Virus code must start with 2 letters"
      )
    })

    test("should return validation error for missing fields", async () => {
      const invalidVirus = { cv: "XY78" }

      const response = await request(app)
        .post("/api/viruses")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(invalidVirus)
      expect(response.status).toBe(400)
      expect(response.body.error).toBe(MESSAGES.MISSING_REQUIRED_FIELDS)
    })
  })

  describe("GET /api/viruses", () => {
    test("should return all viruses", async () => {
      const response = await request(app)
        .get("/api/viruses")
        .set("Authorization", `Bearer ${adminToken}`)

      expect(response.status).toBe(200)
      expect(Array.isArray(response.body.data)).toBe(true)
    })
  })

  describe("GET /api/viruses/name/:name", () => {
    test("should retrieve a virus by its name", async () => {
      const response = await request(app)
        .get("/api/viruses/name/Influenza")
        .set("Authorization", `Bearer ${adminToken}`)

      expect(response.status).toBe(200)
      expect(response.body.data.name).toBe("Influenza")
    })

    test("should return 404 if the virus is not found by name", async () => {
      const response = await request(app)
        .get("/api/viruses/name/UnknownVirus")
        .set("Authorization", `Bearer ${adminToken}`)

      expect(response.status).toBe(404)
      expect(response.body.error).toBe(MESSAGES.VIRUS_NOT_FOUND_BY_NAME)
    })
  })

  describe("GET /api/viruses/cv/:cv", () => {
    test("should retrieve a virus by its code", async () => {
      const response = await request(app)
        .get("/api/viruses/cv/AB12")
        .set("Authorization", `Bearer ${adminToken}`)

      expect(response.status).toBe(200)
      expect(response.body.data.cv).toBe("AB12")
    })

    test("should return 404 if the virus is not found by code", async () => {
      const response = await request(app)
        .get("/api/viruses/cv/ZZ99")
        .set("Authorization", `Bearer ${adminToken}`)

      expect(response.status).toBe(404)
      expect(response.body.error).toBe(MESSAGES.VIRUS_NOT_FOUND_BY_CODE)
    })
  })

  describe("PUT /api/viruses/:cv", () => {
    test("should update an existing virus' name", async () => {
      const updatedVirusData = { name: "UpdatedInfluenza", cv: "AB12" }

      const response = await request(app)
        .put("/api/viruses/AB12")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updatedVirusData)

      expect(response.status).toBe(200)
      expect(response.body.data.name).toBe("UpdatedInfluenza")
    })
  })
  
  describe("GET /api/viruses/name/:name", () => {
    test("should retrieve a virus by its new name", async () => {
      const response = await request(app).get(
        "/api/viruses/name/UpdatedInfluenza"
      )

      expect(response.status).toBe(200)
      expect(response.body.data.name).toBe("UpdatedInfluenza")
    })
  })

  describe("PUT /api/viruses/:cv", () => {
    test("should update an existing virus' code", async () => {
      const updatedVirusData = { name: "UpdatedInfluenza", cv: "AB13" }

      const response = await request(app)
        .put("/api/viruses/AB12")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updatedVirusData)

      expect(response.status).toBe(200)
      expect(response.body.data.cv).toBe("AB13")
    })
  })

  describe("GET /api/viruses/cv/:cv", () => {
    test("should retrieve a virus by its new code", async () => {
      const response = await request(app).get("/api/viruses/cv/AB13")

      expect(response.status).toBe(200)
      expect(response.body.data.cv).toBe("AB13")
    })
  })

  describe("PUT /api/viruses/:cv", () => {
    test("should return 404 if virus to update is not found", async () => {
      const updatedVirusData = { name: "NonExistentVirus", cv: "AB22" }

      const response = await request(app)
        .put("/api/viruses/ZZ99")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updatedVirusData)

      expect(response.status).toBe(404)
      expect(response.body.error).toBe(MESSAGES.VIRUS_NOT_FOUND_BY_CODE)
    })
  })

  describe("DELETE /api/viruses/:cv", () => {
    test("should delete a virus by its code", async () => {
      const response = await request(app)
        .delete("/api/viruses/AB13")
        .set("Authorization", `Bearer ${adminToken}`)

      expect(response.status).toBe(200)
      expect(response.body.message).toBe(MESSAGES.VIRUS_DELETED)
    })

    test("should return 404 if virus to delete is not found", async () => {
      const response = await request(app)
        .delete("/api/viruses/ZZ99")
        .set("Authorization", `Bearer ${adminToken}`)

      expect(response.status).toBe(404)
      expect(response.body.error).toBe(MESSAGES.VIRUS_NOT_FOUND_BY_CODE)
    })
  })

  describe("GET /api/viruses/cv/:cv", () => {
    test("should not retrieve the deleted virus by its code", async () => {
      const response = await request(app).get("/api/viruses/cv/AB13")

      expect(response.status).toBe(404)
      expect(response.body.error).toBe(MESSAGES.VIRUS_NOT_FOUND_BY_CODE)
    })
    test("should not retrieve the deleted virus by its name", async () => {
      const response = await request(app).get(
        "/api/viruses/name/UpdatedInfluenza"
      )

      expect(response.status).toBe(404)
      expect(response.body.error).toBe(MESSAGES.VIRUS_NOT_FOUND_BY_NAME)
    })
  })
})
