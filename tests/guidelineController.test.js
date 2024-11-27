import mongoose from "mongoose"
import dotenv from "dotenv"
import request from "supertest"

import Outbreak from "../src/models/outbreakModel.js"
import { app, server } from "../src/app.js"
import { MESSAGES } from "../src/utils/responseMessages.js"

dotenv.config()

let authToken

describe("Guideline API Tests with Authentication", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.DB_TEST_CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    const newZone = { cz: "Z1", name: "ZoneTest1" }
    const zoneResponse = await request(app)
      .post("/api/zones")
      .set("Authorization", `Bearer ${AdminToken}`)
      .send(newZone)
    expect(zoneResponse.status).toBe(201)

    const newZone1 = { cz: "Z2", name: "ZoneTest2" }
    const zoneResponse1 = await request(app)
      .post("/api/zones")
      .set("Authorization", `Bearer ${AdminToken}`)
      .send(newZone1)
    expect(zoneResponse1.status).toBe(201)

    const newVirus = { cv: "VV11", name: "VirusTest1" }
    const virusResponse = await request(app)
      .post("/api/viruses")
      .set("Authorization", `Bearer ${AdminToken}`)
      .send(newVirus)
    expect(virusResponse.status).toBe(201)

    const newOutbreak = {
      co: "1O",
      zone: "Z1",
      virus: "VV11",
      startDate: "2024/10/10",
    }
    const outbreakResponse = await request(app)
      .post("/api/outbreaks")
      .set("Authorization", `Bearer ${AdminToken}`)
      .send(newOutbreak)
    expect(outbreakResponse.status).toBe(201)

    const newOutbreak1 = {
      co: "2O",
      zone: "Z2",
      virus: "VV11",
      startDate: "2024/10/10",
    }
    const outbreakResponse1 = await request(app)
      .post("/api/outbreaks")
      .set("Authorization", `Bearer ${AdminToken}`)
      .send(newOutbreak1)
    expect(outbreakResponse1.status).toBe(201)

    const adminUser = { username: "admin", password: "testadmin123" }

    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send(adminUser)
    expect(loginResponse.status).toBe(200)
    authToken = loginResponse.body.userToken
  })
})

afterAll(async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
  server.close()
})

describe("GET /api/guidelines", () => {
  test("should return 404 for no found guidelines", async () => {
    const response = await request(app)
      .get("/api/guidelines")
      .set("Authorization", `Bearer ${authToken}`)

    expect(response.status).toBe(404)
    expect(Array.isArray(response.body.data)).toBe(false)
  })
})

describe("POST /api/guidelines", () => {
  test("should create a new guideline", async () => {
    const newGuideline = {
      cg: "11GG",
      outbreak: "1O",
      validityPeriod: 10,
    }

    const guidelineOutbreak = await Outbreak.findOne({
      co: newGuideline.outbreak,
    })

    const response = await request(app)
      .post("/api/guidelines")
      .set("Authorization", `Bearer ${authToken}`)
      .send(newGuideline)
    expect(response.status).toBe(201)
    expect(response.body.data.cg).toBe("11GG")
    expect(response.body.data.outbreak).toBe(guidelineOutbreak._id.toString())
    expect(response.body.data.validityPeriod).toBe(10)
  })

  test("should not create a duplicate guideline code", async () => {
    const newGuideline = {
      cg: "22GG",
      outbreak: "1O",
      validityPeriod: 10,
    }

    const firstResponse = await request(app)
      .post("/api/guidelines")
      .set("Authorization", `Bearer ${authToken}`)
      .send(newGuideline)
    expect(firstResponse.status).toBe(201)

    const secondResponse = await request(app)
      .post("/api/guidelines")
      .set("Authorization", `Bearer ${authToken}`)
      .send(newGuideline)
    expect(secondResponse.status).toBe(400)
    expect(secondResponse.body.error).toBe(MESSAGES.DUPLICATE_GUIDELINE)
  })

  test("should return validation error for invalid guideline code", async () => {
    const invalidGuideline = {
      cg: "GG11",
      outbreak: "1O",
      validityPeriod: 10,
    }

    const response = await request(app)
      .post("/api/guidelines")
      .set("Authorization", `Bearer ${authToken}`)
      .send(invalidGuideline)
    expect(response.status).toBe(400)
    expect(response.body.error.message).toContain(
      "Guideline code must have 2 numbers and 2 letters"
    )
  })

  test("should return 400 for no matching outbreak code", async () => {
    const unknownOutbreak = {
      cg: "22GG",
      outbreak: "3O",
      validityPeriod: 10,
    }

    const response = await request(app)
      .post("/api/guidelines")
      .set("Authorization", `Bearer ${authToken}`)
      .send(unknownOutbreak)
    expect(response.status).toBe(400)
    expect(response.body.error).toBe(MESSAGES.OUTBREAK_NOT_FOUND_BY_CODE)
  })

  test("should return validation error for missing fields", async () => {
    const invalidGuideline = { cg: "33GG" }

    const response = await request(app)
      .post("/api/guidelines")
      .set("Authorization", `Bearer ${authToken}`)
      .send(invalidGuideline)
    expect(response.status).toBe(400)
    expect(response.body.error).toBe(MESSAGES.MISSING_REQUIRED_FIELDS)
  })
})

describe("GET /api/guidelines", () => {
  test("should return all guidelines", async () => {
    const response = await request(app)
      .get("/api/guidelines")
      .set("Authorization", `Bearer ${authToken}`)

    expect(response.status).toBe(200)
    expect(Array.isArray(response.body.data)).toBe(true)
  })
})

describe("GET /api/guidelines/cg/:cg", () => {
  test("should retrieve a guideline by its code", async () => {
    const response = await request(app)
      .get("/api/guidelines/cg/11GG")
      .set("Authorization", `Bearer ${authToken}`)

    expect(response.status).toBe(200)
    expect(response.body.data.cg).toBe("11GG")
  })

  test("should return 404 if the guideline is not found by code", async () => {
    const response = await request(app)
      .get("/api/guidelines/cg/33GG")
      .set("Authorization", `Bearer ${authToken}`)

    expect(response.status).toBe(404)
    expect(response.body.error).toBe(MESSAGES.GUIDELINE_NOT_FOUND_BY_CODE)
  })
})

describe("GET /api/guideline/status/:status", () => {
  test("should retrieve a guideline by its status", async () => {
    const response = await request(app)
      .get("/api/guidelines/status/false")
      .set("Authorization", `Bearer ${authToken}`)

    expect(response.status).toBe(200)
    expect(Array.isArray(response.body.data)).toBe(true)
  })

  test("should return 404 if the guideline is not found by status", async () => {
    const response = await request(app)
      .get("/api/guidelines/status/true")
      .set("Authorization", `Bearer ${authToken}`)

    expect(response.status).toBe(404)
    expect(response.body.error).toBe(MESSAGES.GUIDELINE_NOT_FOUND_BY_STATUS)
  })

  test("should return 400 if the status parameter is invalid", async () => {
    const response = await request(app)
      .get("/api/guidelines/status/1111")
      .set("Authorization", `Bearer ${authToken}`)

    expect(response.status).toBe(400)
    expect(response.body.error).toBe(MESSAGES.INVALID_STATUS_PARAMETER)
  })
})

describe("PUT /api/guidelines/:cg", () => {
  test("should update an existing guideline code", async () => {
    const updatedGuidelineData = {
      cg: "12GG",
      outbreak: "1O",
      validityPeriod: 10,
    }

    const response = await request(app)
      .put("/api/guidelines/11GG")
      .set("Authorization", `Bearer ${authToken}`)
      .send(updatedGuidelineData)

    expect(response.status).toBe(201)
    expect(response.body.data.cg).toBe("12GG")
  })

  test("should find guideline with updated code", async () => {
    const response = await request(app).get("/api/guidelines/cg/12GG")

    expect(response.status).toBe(200)
    expect(response.body.data.cg).toBe("12GG")
  })

  test("should update an existing guideline outbreak", async () => {
    const updatedGuidelineData = {
      cg: "12GG",
      outbreak: "2O",
      validityPeriod: 10,
    }

    const response = await request(app)
      .put("/api/guidelines/12GG")
      .set("Authorization", `Bearer ${authToken}`)
      .send(updatedGuidelineData)

    expect(response.status).toBe(201)
    expect(response.body.data.outbreak.co).toBe("2O")
  })

  test("should find guideline with updated outbreak", async () => {
    const response = await request(app).get("/api/guidelines/cg/12GG")

    expect(response.status).toBe(200)
    expect(response.body.data.outbreak.co).toBe("2O")
  })

  test("should update an existing guideline validity period", async () => {
    const updatedGuidelineData = {
      cg: "12GG",
      outbreak: "2O",
      validityPeriod: 15,
    }

    const response = await request(app)
      .put("/api/guidelines/12GG")
      .set("Authorization", `Bearer ${authToken}`)
      .send(updatedGuidelineData)

    expect(response.status).toBe(201)
    expect(response.body.data.validityPeriod).toBe(15)
  })

  test("should find guideline with updated validity period", async () => {
    const response = await request(app).get("/api/guidelines/cg/12GG")

    expect(response.status).toBe(200)
    expect(response.body.data.validityPeriod).toBe(15)
  })

  test("should return 400 if guideline to update is not found", async () => {
    const updatedGuidelineData = {
      cg: "13GG",
      outbreak: "1O",
      validityPeriod: 10,
    }

    const response = await request(app)
      .put("/api/guidelines/11GG")
      .set("Authorization", `Bearer ${authToken}`)
      .send(updatedGuidelineData)

    expect(response.status).toBe(400)
    expect(response.body.error).toBe(MESSAGES.GUIDELINE_NOT_FOUND_BY_CODE)
  })

  test("should return 400 if guideline to update has missing fields", async () => {
    const updatedGuidelineData = {
      cg: "13GG",
      outbreak: "1O",
    }

    const response = await request(app)
      .put("/api/guidelines/12GG")
      .set("Authorization", `Bearer ${authToken}`)
      .send(updatedGuidelineData)

    expect(response.status).toBe(400)
    expect(response.body.error).toBe(MESSAGES.MISSING_REQUIRED_FIELDS)
  })

  test("should return 400 if guideline to update has duplicate guideline code", async () => {
    const updatedGuidelineData = {
      cg: "22GG",
      outbreak: "1O",
      validityPeriod: 15,
    }

    const response = await request(app)
      .put("/api/guidelines/12GG")
      .set("Authorization", `Bearer ${authToken}`)
      .send(updatedGuidelineData)

    expect(response.status).toBe(400)
    expect(response.body.error).toBe(MESSAGES.DUPLICATE_GUIDELINE)
  })

  test("should return 400 if updated outbreak doesn't exist", async () => {
    const updatedGuidelineData = {
      cg: "12GG",
      outbreak: "5O",
      validityPeriod: 15,
    }

    const response = await request(app)
      .put("/api/guidelines/12GG")
      .set("Authorization", `Bearer ${authToken}`)
      .send(updatedGuidelineData)

    expect(response.status).toBe(400)
    expect(response.body.error).toBe(MESSAGES.OUTBREAK_NOT_FOUND_BY_CODE)
  })

  test("should return 400 if updated guideline code isn't valid", async () => {
    const updatedGuidelineData = {
      cg: "GG12",
      outbreak: "2O",
      validityPeriod: 15,
    }

    const response = await request(app)
      .put("/api/guidelines/12GG")
      .set("Authorization", `Bearer ${authToken}`)
      .send(updatedGuidelineData)

    expect(response.status).toBe(400)
    expect(response.body.error.message).toContain(
      "Guideline code must have 2 numbers and 2 letters"
    )
  })
})

describe("DELETE /api/guidelines", () => {
  test("should return 400 if guideline to delete is not expired", async () => {
    const response = await request(app)
      .delete("/api/guidelines/expired/12GG")
      .set("Authorization", `Bearer ${authToken}`)

    expect(response.status).toBe(400)
    expect(response.body.error).toBe(MESSAGES.GUIDELINE_NOT_EXPIRED)
  })

  test("should delete a guideline by its code", async () => {
    const response = await request(app)
      .delete("/api/guidelines/12GG")
      .set("Authorization", `Bearer ${authToken}`)

    expect(response.status).toBe(200)
    expect(response.body.message).toBe(MESSAGES.GUIDELINE_DELETED)
  })

  test("should return 400 if guideline to delete is not found", async () => {
    const response = await request(app)
      .delete("/api/guidelines/12GG")
      .set("Authorization", `Bearer ${authToken}`)

    expect(response.status).toBe(400)
    expect(response.body.error).toBe(MESSAGES.GUIDELINE_NOT_FOUND_BY_CODE)
  })
})
