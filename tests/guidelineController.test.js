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
let guidelineOutbreak

describe("Guideline API Tests with Authentication", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.DB_TEST_CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    const guidelineZone = await Zone.create({cz: "Z1", name: "ZoneTest1"})
    const guidelineVirus = await Virus.create({cv: "VV11", name: "VirusTest1"})
    guidelineOutbreak = await Outbreak.create({co: "1O", zone: guidelineZone._id, virus: guidelineVirus._id, startDate: "2024/10/10"})

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

  describe("POST /api/guidelines", () => {
    test("should create a new guideline", async () => {
      const newGuideline = { cg: "11GG", outbreak: guidelineOutbreak._id, validityPeriod: 10 }

      const response = await request(app)
        .post("/api/guidelines")
        /* .set("Authorization", `Bearer ${authToken}`) */
        .send(newGuideline)
      expect(response.status).toBe(201)
      expect(response.body.data.cg).toBe("11GG")
      expect(response.body.data.outbreak).toBe(guidelineOutbreak._id)
      expect(response.body.data.validityPeriod).toBe(10)
    })

    test("should not create a duplicate guideline code", async () => {
      const newGuideline = { cg: "22GG", outbreak: guidelineOutbreak._id, validityPeriod:10 }

      const firstResponse = await request(app)
        .post("/api/guidelines")
        /* .set("Authorization", `Bearer ${authToken}`) */
        .send(newGuideline)
      expect(firstResponse.status).toBe(201)

      const secondResponse = await request(app)
        .post("/api/guidelines")
        /* .set("Authorization", `Bearer ${authToken}`) */
        .send(newGuideline)
      expect(secondResponse.status).toBe(400)
      expect(secondResponse.body.error).toBe(MESSAGES.DUPLICATE_GUIDELINE)
    })

    test("should return validation error for invalid guideline code", async () => {
      const invalidGuideline = { cg: "GG11", outbreak: guidelineOutbreak._id, validityPeriod: 10 }

      const response = await request(app)
        .post("/api/guideline")
        /* .set("Authorization", `Bearer ${authToken}`) */
        .send(invalidGuideline)
      expect(response.status).toBe(400)
      expect(response.body.error.message).toContain(
        "Guideline code must have 2 numbers and 2 letters"
      )
    })

    test("should return validation error for missing fields", async () => {
      const invalidGuideline = { cg: "33GG" }

      const response = await request(app)
        .post("/api/guidelines")
        /* .set("Authorization", `Bearer ${authToken}`) */
        .send(invalidGuideline)
      expect(response.status).toBe(400)
      expect(response.body.error).toBe(MESSAGES.MISSING_REQUIRED_FIELDS)
    })
  })

  describe("GET /api/guidelines", () => {
    test("should return all guidelines", async () => {
      const response = await request(app).get("/api/guidelines")
      /* .set("Authorization", `Bearer ${authToken}`) */

      expect(response.status).toBe(200)
      expect(Array.isArray(response.body.data)).toBe(true)
    })
  })

  describe("GET /api/guidelines/code/:code", () => {
    test("should retrieve a guideline by its code", async () => {
      const response = await request(app).get("/api/guidelines/code/11GG")
      /* .set("Authorization", `Bearer ${authToken}`) */

      expect(response.status).toBe(200)
      expect(response.body.data.code).toBe("11GG")
    })

    test("should return 404 if the guideline is not found by code", async () => {
      const response = await request(app).get("/api/guidelines/code/33GG")
      /* .set("Authorization", `Bearer ${authToken}`) */

      expect(response.status).toBe(404)
      expect(response.body.error).toBe(MESSAGES.GUIDELINE_NOT_FOUND_BY_CODE)
    })
  })

  describe("GET /api/guideline/status/:status", () => {
    test("should retrieve a guideline by its status", async () => {
      const response = await request(app).get("/api/guidelines/status/false")
      /* .set("Authorization", `Bearer ${authToken}`) */

      expect(response.status).toBe(200)
      expect(response.body.data.isExpired).toBe("false")
    })

    test("should return 404 if the guideline is not found by status", async () => {
      const response = await request(app).get("/api/guidelines/status/true")
      /* .set("Authorization", `Bearer ${authToken}`) */

      expect(response.status).toBe(404)
      expect(response.body.error).toBe(MESSAGES.GUIDELINE_NOT_FOUND_BY_STATUS)
    })
  })

  describe("PUT /api/guidelines/:cg", () => {
    test("should update an existing guideline", async () => {
      const updatedGuidelineData = { cg: "12GG", outbreak: guidelineOutbreak._id, validityPeriod: 10  }

      const response = await request(app)
        .put("/api/guidelines/11GG")
        /* .set("Authorization", `Bearer ${authToken}`) */
        .send(updatedGuidelineData)

      expect(response.status).toBe(201)
      expect(response.body.data.cg).toBe("12GG")
    })

    test("should return 400 if guideline to update is not found", async () => {
      const updatedGuidelineData = { cg: "13GG", outbreak: guidelineOutbreak._id, validityPeriod: 10 }

      const response = await request(app)
        .put("/api/guidelines/11GG")
        /* .set("Authorization", `Bearer ${authToken}`) */
        .send(updatedGuidelineData)

      expect(response.status).toBe(400)
      expect(response.body.error).toBe(MESSAGES.GUIDELINE_NOT_FOUND_BY_CODE)
    })
  })

  describe("DELETE /api/guidelines/expired/:cg", () => {

    test("should return 400 if guideline to delete is not expired", async () => {
        const response = await request(app).delete("/api/guideline/expired/11GG")
        /* .set("Authorization", `Bearer ${authToken}`) */
  
        expect(response.status).toBe(400)
        expect(response.body.error).toBe(MESSAGES.GUIDELINE_NOT_EXPIRED)
      })

    test("should delete a guideline by its code", async () => {
      const response = await request(app).delete("/api/guidelines/11GG")
      /* .set("Authorization", `Bearer ${authToken}`) */

      expect(response.status).toBe(200)
      expect(response.body.message).toBe(MESSAGES.GUIDELINE_DELETED)
    })

    test("should return 400 if guideline to delete is not found", async () => {
      const response = await request(app).delete("/api/guideline/11GG")
      /* .set("Authorization", `Bearer ${authToken}`) */

      expect(response.status).toBe(400)
      expect(response.body.error).toBe(MESSAGES.GUIDELINE_NOT_FOUND_BY_CODE)
    })
  })
})
