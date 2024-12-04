import request from "supertest"

import Guideline from "../src/models/guidelineModel.js"
import { app } from "../src/app.js"
import { MESSAGES } from "../src/utils/responseMessages.js"
import { adminToken, employeeToken } from "./setup/testSetup.js"

describe("Outbreak API Tests with Authentication", () => {
  let zone
  let virus

  beforeAll(async () => {
    /* ---------------------- Create prerequisites for test --------------------- */
    const newZone = { cz: "A2", name: "ZonaA2" }
    const zoneResponse = await request(app)
      .post("/api/zones")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(newZone)
    expect(zoneResponse.status).toBe(201)
    zone = zoneResponse.body.data.cz

    const newVirus = { cv: "AB12", name: "ValidVirus" }
    const virusResponse = await request(app)
      .post("/api/viruses")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(newVirus)
    expect(virusResponse.status).toBe(201)

    virus = virusResponse.body.data.cz

    const newZone2 = { cz: "B2", name: "ZonaB2" }
    const zoneResponse2 = await request(app)
      .post("/api/zones")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(newZone2)
    expect(zoneResponse2.status).toBe(201)
    zone = zoneResponse2.body.data.cz

    const newVirus2 = { cv: "XZ12", name: "VirusXZ" }
    const virusResponse2 = await request(app)
      .post("/api/viruses")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(newVirus2)
    expect(virusResponse2.status).toBe(201)
    virus = virusResponse2.body.data.cz

    const newZone3 = { cz: "C2", name: "ZonaC2" }
    const zoneResponse3 = await request(app)
      .post("/api/zones")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(newZone3)
    expect(zoneResponse3.status).toBe(201)
    zone = zoneResponse3.body.data.cz

    const newVirus3 = { cv: "VV12", name: "VirusVV" }
    const virusResponse3 = await request(app)
      .post("/api/viruses")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(newVirus3)
    expect(virusResponse3.status).toBe(201)
    virus = virusResponse3.body.data.cz

    const newZone4 = { cz: "X7", name: "ZonaX7" }
    const zoneResponse4 = await request(app)
      .post("/api/zones")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(newZone4)
    expect(zoneResponse4.status).toBe(201)
    zone = zoneResponse4.body.data.cz

    const newVirus4 = { cv: "XX77", name: "VirusXX77" }
    const virusResponse4 = await request(app)
      .post("/api/viruses")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(newVirus4)
    expect(virusResponse4.status).toBe(201)
    virus = virusResponse4.body.data.cz
  })

  describe("GET /api/outbreaks", () => {
    test("should return no outbreaks from empty DB", async () => {
      const response = await request(app).get("/api/outbreaks")

      expect(response.status).toBe(404)
      expect(response.body.error).toBe(MESSAGES.NO_OUTBREAKS_FOUND)
    })

    test("should return no active outbreaks from empty DB", async () => {
      const response = await request(app).get("/api/outbreaks/condition/active")

      expect(response.status).toBe(404)
      expect(response.body.error).toBe(MESSAGES.NO_OUTBREAKS_FOUND)
    })

    test("should return no active outbreaks from empty DB", async () => {
      const response = await request(app).get(
        "/api/outbreaks/condition/occurred"
      )

      expect(response.status).toBe(404)
      expect(response.body.error).toBe(MESSAGES.NO_OUTBREAKS_FOUND)
    })
  })

  describe("GET /api/outbreaks", () => {
    test("should not find an outbreak that doesn't exist", async () => {
      const response = await request(app).get("/api/outbreaks/co/NoCo")

      expect(response.status).toBe(404)
      expect(response.body.error).toBe(MESSAGES.OUTBREAK_NOT_FOUND_BY_CODE)
    })

    test("should not find an outbreak by virus code that doesn't exist", async () => {
      const response = await request(app).get("/api/outbreaks/cv/NoCv")

      expect(response.status).toBe(404)
      expect(response.body.error).toBe(MESSAGES.VIRUS_NOT_FOUND_BY_CODE)
    })

    test("should not find an outbreak by zone code that doesn't exist", async () => {
      const response = await request(app).get("/api/outbreaks/cz/NoCz")

      expect(response.status).toBe(404)
      expect(response.body.error).toBe(MESSAGES.ZONE_NOT_FOUND_BY_CODE)
    })

    test("should not find an outbreak by virus code that is not linked to any outbreak", async () => {
      const response = await request(app).get("/api/outbreaks/cv/AB12")

      expect(response.status).toBe(404)
      expect(response.body.error).toBe(MESSAGES.NO_OUTBREAKS_FOUND)
    })

    test("should not find an outbreak by zone code that is not linked to any outbreak", async () => {
      const response = await request(app).get("/api/outbreaks/cz/A2")

      expect(response.status).toBe(404)
      expect(response.body.error).toBe(MESSAGES.NO_OUTBREAKS_FOUND)
    })
  })

  describe("POST /api/outbreaks", () => {
    test.skip("should not create a new outbreak without authentication", async () => {
      const newOutbreak = {
        co: "8X",
        virus: "AB12",
        zone: "A2",
        startDate: "2010/10/10",
      }

      const response = await request(app)
        .post("/api/outbreaks")
        .send(newOutbreak)
      expect(response.status).toBe(403)
      expect(countryResponse.body.error).toBe(MESSAGES.AUTH_REQUIRED)
    })

    test("should create a new outbreak", async () => {
      const newOutbreak = {
        co: "8X",
        virus: "AB12",
        zone: "A2",
        startDate: "2010/10/10",
      }

      const response = await request(app)
        .post("/api/outbreaks")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(newOutbreak)
      expect(response.status).toBe(201)
      expect(response.body.data.co).toBe("8x")
    })

    test("should create a new outbreak with employee logged in", async () => {
      const newOutbreak = {
        co: "0L",
        virus: "XX77",
        zone: "X7",
        startDate: "2010/10/10",
      }

      const response = await request(app)
        .post("/api/outbreaks")
        .set("Authorization", `Bearer ${employeeToken}`)
        .send(newOutbreak)
      expect(response.status).toBe(201)
      expect(response.body.data.co).toBe("0l")
    })

    test("should not create a duplicate outbreak code", async () => {
      const newOutbreak = {
        co: "8X",
        virus: "XZ12",
        zone: "A2",
        startDate: "2010/10/10",
      }
      const response = await request(app)
        .post("/api/outbreaks")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(newOutbreak)
      expect(response.status).toBe(400)
      expect(response.body.error).toBe(MESSAGES.DUPLICATE_OUTBREAK)
    })

    test("should return validation error for invalid outbreak code", async () => {
      const invalidOutbreak = {
        co: "8XXA",
        virus: "XZ12",
        zone: "A2",
        startDate: "2010/10/10",
      }
      const response = await request(app)
        .post("/api/outbreaks")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(invalidOutbreak)
      expect(response.status).toBe(400)
      expect(response.body.error).toBe(MESSAGES.OUTBREAK_CODE_VALIDATION_ERROR)
    })

    test("should return validation error for invalid outbreak code", async () => {
      const invalidOutbreak = {
        co: "8A",
        virus: "InvalidVirus",
        zone: "A2",
        startDate: "2010/10/10",
      }
      const response = await request(app)
        .post("/api/outbreaks")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(invalidOutbreak)
      expect(response.status).toBe(404)
      expect(response.body.error).toBe(MESSAGES.VIRUS_NOT_FOUND_BY_CODE)
    })

    test("should return validation error for invalid outbreak code", async () => {
      const invalidOutbreak = {
        co: "8A",
        virus: "XZ12",
        zone: "InvalidZone",
        startDate: "2010/10/10",
      }
      const response = await request(app)
        .post("/api/outbreaks")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(invalidOutbreak)
      expect(response.status).toBe(404)
      expect(response.body.error).toBe(MESSAGES.ZONE_NOT_FOUND_BY_CODE)
    })

    test("should return validation error for missing fields", async () => {
      const invalidOutbreak = { co: "3T" }

      const response = await request(app)
        .post("/api/viruses")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(invalidOutbreak)
      expect(response.status).toBe(400)
      expect(response.body.error).toBe(MESSAGES.MISSING_REQUIRED_FIELDS)
    })

    test("should return error for invalid start date format", async () => {
      const invalidOutbreak = {
        co: "8A",
        virus: "XZ12",
        zone: "A2",
        startDate: "abc",
      }
      const response = await request(app)
        .post("/api/outbreaks")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(invalidOutbreak)
      expect(response.status).toBe(400)
      expect(response.body.error).toBe(MESSAGES.INVALID_STARTDATE_FORMAT)
    })

    test("should return error for invalid end date format", async () => {
      const invalidOutbreak = {
        co: "8A",
        virus: "XZ12",
        zone: "A2",
        startDate: "2010/10/10",
        endDate: "abc",
      }
      const response = await request(app)
        .post("/api/outbreaks")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(invalidOutbreak)
      expect(response.status).toBe(400)
      expect(response.body.error).toBe(MESSAGES.INVALID_ENDDATE_FORMAT)
    })

    test("should not create outbreak because outbreak already exists", async () => {
      const invalidOutbreak = {
        co: "8A",
        virus: "AB12",
        zone: "A2",
        startDate: "2010/10/10",
      }

      const response = await request(app)
        .post("/api/outbreaks")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(invalidOutbreak)
      expect(response.status).toBe(400)
      expect(response.body.error).toBe(MESSAGES.OUTBREAK_ALREADY_EXISTS)
    })

    test("should not create outbreak because startdate is in the future", async () => {
      const invalidOutbreak = {
        co: "8A",
        virus: "XZ12",
        zone: "A2",
        startDate: "2056/04/04",
      }
      const response = await request(app)
        .post("/api/outbreaks")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(invalidOutbreak)
      expect(response.status).toBe(400)
      expect(response.body.error).toBe(MESSAGES.FUTURE_STARTDATE)
    })

    test("should not create outbreak because enddate is in the future", async () => {
      const invalidOutbreak = {
        co: "8A",
        virus: "XZ12",
        zone: "A2",
        startDate: "2010/10/10",
        endDate: "2056/10/10",
      }
      const response = await request(app)
        .post("/api/outbreaks")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(invalidOutbreak)
      expect(response.status).toBe(400)
      expect(response.body.error).toBe(MESSAGES.FUTURE_ENDDATE)
    })

    test("should not create outbreak because enddate is before startdate", async () => {
      const invalidOutbreak = {
        co: "8A",
        virus: "XZ12",
        zone: "A2",
        startDate: "2010/10/10",
        endDate: "2009/10/10",
      }
      const response = await request(app)
        .post("/api/outbreaks")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(invalidOutbreak)
      expect(response.status).toBe(400)
      expect(response.body.error).toBe(MESSAGES.ENDDATE_BEFORE_STARTDATE)
    })

    test("should create a new occurred outbreak", async () => {
      const newOutbreak = {
        co: "8A",
        virus: "XZ12",
        zone: "A2",
        startDate: "2010/10/10",
        endDate: "2012/10/10",
      }

      const response = await request(app)
        .post("/api/outbreaks")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(newOutbreak)
      expect(response.status).toBe(201)
      expect(response.body.data.condition).toBe("occurred")
    })
  })

  describe("GET /api/outbreaks", () => {
    test("should return all outbreaks", async () => {
      const response = await request(app).get("/api/outbreaks")

      expect(response.status).toBe(200)
      expect(Array.isArray(response.body.data)).toBe(true)
    })

    test("should return all outbreaks with employee logged in", async () => {
      const response = await request(app)
        .get("/api/outbreaks")
        .set("Authorization", `Bearer ${adminToken}`)

      expect(response.status).toBe(200)
      expect(Array.isArray(response.body.data)).toBe(true)
    })

    test("should return all active outbreaks", async () => {
      const response = await request(app).get("/api/outbreaks/condition/active")

      expect(response.status).toBe(200)
      expect(Array.isArray(response.body.data)).toBe(true)
      expect(response.body.data[0].condition).toBe("active")
    })

    test("should return all occurred outbreaks", async () => {
      const response = await request(app).get(
        "/api/outbreaks/condition/occurred"
      )

      expect(response.status).toBe(200)
      expect(Array.isArray(response.body.data)).toBe(true)
      expect(response.body.data[0].condition).toBe("occurred")
    })

    test("should return outbreak with correct code", async () => {
      const response = await request(app).get("/api/outbreaks/co/8A")

      expect(response.status).toBe(200)
      expect(response.body.data.co).toBe("8a")
    })

    test("should return outbreaks with correct virus code", async () => {
      const response = await request(app).get("/api/outbreaks/cv/XZ12")

      expect(response.status).toBe(200)
      expect(Array.isArray(response.body.data)).toBe(true)
      expect(response.body.data[0].virus).toBe("xz12")
    })

    test("should return outbreaks with correct zone code", async () => {
      const response = await request(app).get("/api/outbreaks/cz/A2")

      expect(response.status).toBe(200)
      expect(Array.isArray(response.body.data)).toBe(true)
      expect(response.body.data[0].zone).toBe("a2")
    })

    test("should not find outbreaks with given virus code", async () => {
      const response = await request(app).get("/api/outbreaks/cv/VV12")

      expect(response.status).toBe(404)
      expect(response.body.error).toBe(MESSAGES.NO_OUTBREAKS_FOUND)
    })

    test("should not find outbreaks with given zone code", async () => {
      const response = await request(app).get("/api/outbreaks/cz/C2")

      expect(response.status).toBe(404)
      expect(response.body.error).toBe(MESSAGES.NO_OUTBREAKS_FOUND)
    })
  })

  describe("PUT /api/outbreaks/co/:co", () => {
    test.skip("should not update an outbreak without authentication", async () => {
      const newOutbreak = {
        co: "1Z",
        virus: "XZ12",
        zone: "A2",
        startDate: "2010/10/10",
        endDate: "2012/10/10",
      }

      const response = await request(app)
        .put("/api/outbreaks/co/8A")
        .send(newOutbreak)

      expect(response.status).toBe(403)
      expect(response.body.error).toBe(MESSAGES.AUTH_REQUIRED)
    })

    test("should update an existing outbreak's code", async () => {
      const newOutbreak = {
        co: "1Z",
        virus: "XZ12",
        zone: "A2",
        startDate: "2010/10/10",
        endDate: "2012/10/10",
      }

      const response = await request(app)
        .put("/api/outbreaks/co/8A")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(newOutbreak)

      expect(response.status).toBe(200)
      expect(response.body.data.co).toBe("1z")
    })

    test("should find outbreak with updated code", async () => {
      const response = await request(app).get("/api/outbreaks/co/1Z")

      expect(response.status).toBe(200)
      expect(response.body.data.co).toBe("1z")
    })

    test("should update an existing outbreak's code with employee logged in", async () => {
      const newOutbreak = {
        co: "7X",
        virus: "XX77",
        zone: "X7",
        startDate: "2010/10/10",
      }

      const response = await request(app)
        .put("/api/outbreaks/co/0L")
        .set("Authorization", `Bearer ${employeeToken}`)
        .send(newOutbreak)

      expect(response.status).toBe(200)
      expect(response.body.data.co).toBe("7x")
    })

    test("should find outbreak with updated code with employee logged in", async () => {
      const response = await request(app).get("/api/outbreaks/co/7X")

      expect(response.status).toBe(200)
      expect(response.body.data.co).toBe("7x")
    })

    test("should update an existing outbreak's virus", async () => {
      const newOutbreak = {
        co: "1Z",
        virus: "VV12",
        zone: "A2",
        startDate: "2010/10/10",
        endDate: "2012/10/10",
      }

      const response = await request(app)
        .put("/api/outbreaks/co/1Z")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(newOutbreak)

      expect(response.status).toBe(200)
      expect(response.body.data.virus).toBe("vv12")
    })
    test("should find outbreak with updated zone", async () => {
      const response = await request(app).get("/api/outbreaks/co/1Z")

      expect(response.status).toBe(200)
      expect(response.body.data.virus).toBe("vv12")
    })

    test("should update an existing outbreak's zone", async () => {
      const newOutbreak = {
        co: "1Z",
        virus: "VV12",
        zone: "C2",
        startDate: "2010/10/10",
        endDate: "2012/10/10",
      }

      const response = await request(app)
        .put("/api/outbreaks/co/1Z")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(newOutbreak)

      expect(response.status).toBe(200)
      expect(response.body.data.zone).toBe("c2")
    })
    test("should find outbreak with updated zone", async () => {
      const response = await request(app).get("/api/outbreaks/co/1Z")

      expect(response.status).toBe(200)
      expect(response.body.data.zone).toBe("c2")
    })

    test("should find outbreak with updated zone", async () => {
      const response = await request(app).get("/api/outbreaks/co/1Z")

      expect(response.status).toBe(200)
      expect(response.body.data.virus).toBe("vv12")
    })

    test("should update an existing outbreak's startDate", async () => {
      const newOutbreak = {
        co: "1Z",
        virus: "VV12",
        zone: "C2",
        startDate: "2011/10/10",
        endDate: "2012/10/10",
      }

      const response = await request(app)
        .put("/api/outbreaks/co/1Z")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(newOutbreak)

      expect(response.status).toBe(200)
      expect(response.body.data.startDate).toBe("2011-10-09T23:00:00.000Z")
    })
    test("should find outbreak with updated startDate", async () => {
      const response = await request(app).get("/api/outbreaks/co/1Z")

      expect(response.status).toBe(200)
      expect(response.body.data.startDate).toBe("2011-10-09T23:00:00.000Z")
    })

    test("should update an existing outbreak's endDate", async () => {
      const newOutbreak = {
        co: "1Z",
        virus: "VV12",
        zone: "C2",
        startDate: "2011/10/10",
        endDate: "2013/10/10",
      }

      const response = await request(app)
        .put("/api/outbreaks/co/1Z")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(newOutbreak)

      expect(response.status).toBe(200)
      expect(response.body.data.endDate).toBe("2013-10-09T23:00:00.000Z")
    })

    test("should find outbreak with updated endDate", async () => {
      const response = await request(app).get("/api/outbreaks/co/1Z")

      expect(response.status).toBe(200)
      expect(response.body.data.endDate).toBe("2013-10-09T23:00:00.000Z")
    })

    test("should not update an outbreak that doesn't exist", async () => {
      const invalidOutbreak = {
        co: "1Z",
        virus: "XZ12",
        zone: "C2",
        startDate: "2011/10/10",
        endDate: "2013/10/10",
      }
      const response = await request(app)
        .put("/api/outbreaks/co/NoCo")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(invalidOutbreak)

      expect(response.status).toBe(404)
      expect(response.body.error).toBe(MESSAGES.OUTBREAK_NOT_FOUND_BY_CODE)
    })

    test("should return validation error for missing required fields", async () => {
      const invalidOutbreak = { co: "3T" }

      const response = await request(app)
        .put("/api/outbreaks/co/1Z")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(invalidOutbreak)
      expect(response.status).toBe(400)
      expect(response.body.error).toBe(MESSAGES.MISSING_REQUIRED_FIELDS)
    })

    test("should not find the inexistent virus code", async () => {
      const invalidOutbreak = {
        co: "1Z",
        virus: "InvalidVirus",
        zone: "C2",
        startDate: "2011/10/10",
        endDate: "2013/10/10",
      }

      const response = await request(app)
        .put("/api/outbreaks/co/1Z")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(invalidOutbreak)
      expect(response.status).toBe(404)
      expect(response.body.error).toBe(MESSAGES.VIRUS_NOT_FOUND_BY_CODE)
    })

    test("should not find the inexistent zone code", async () => {
      const invalidOutbreak = {
        co: "1Z",
        virus: "VV12",
        zone: "InvalidZone",
        startDate: "2011/10/10",
        endDate: "2013/10/10",
      }

      const response = await request(app)
        .put("/api/outbreaks/co/1Z")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(invalidOutbreak)
      expect(response.status).toBe(404)
      expect(response.body.error).toBe(MESSAGES.ZONE_NOT_FOUND_BY_CODE)
    })

    test("should not update outbreak to invalid startDate format", async () => {
      const invalidOutbreak = {
        co: "1Z",
        virus: "VV12",
        zone: "InvalidZone",
        startDate: "abc",
        endDate: "2013/10/10",
      }

      const response = await request(app)
        .put("/api/outbreaks/co/1Z")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(invalidOutbreak)
      expect(response.status).toBe(400)
      expect(response.body.error).toBe(MESSAGES.INVALID_STARTDATE_FORMAT)
    })

    test("should not update outbreak to invalid endDate format", async () => {
      const invalidOutbreak = {
        co: "1Z",
        virus: "VV12",
        zone: "C2",
        startDate: "2011/10/10",
        endDate: "abc",
      }

      const response = await request(app)
        .put("/api/outbreaks/co/1Z")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(invalidOutbreak)
      expect(response.status).toBe(400)
      expect(response.body.error).toBe(MESSAGES.INVALID_ENDDATE_FORMAT)
    })

    test("should not update outbreak to future startDate", async () => {
      const invalidOutbreak = {
        co: "1Z",
        virus: "VV12",
        zone: "C2",
        startDate: "2056/10/10",
        endDate: "2013/10/10",
      }

      const response = await request(app)
        .put("/api/outbreaks/co/1Z")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(invalidOutbreak)
      expect(response.status).toBe(400)
      expect(response.body.error).toBe(MESSAGES.FUTURE_STARTDATE)
    })

    test("should not update outbreak to future startDate", async () => {
      const invalidOutbreak = {
        co: "1Z",
        virus: "VV12",
        zone: "C2",
        startDate: "2011/10/10",
        endDate: "2056/10/10",
      }

      const response = await request(app)
        .put("/api/outbreaks/co/1Z")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(invalidOutbreak)
      expect(response.status).toBe(400)
      expect(response.body.error).toBe(MESSAGES.FUTURE_ENDDATE)
    })

    test("should not update outbreak because endDate before startDate", async () => {
      const invalidOutbreak = {
        co: "1Z",
        virus: "VV12",
        zone: "C2",
        startDate: "2011/10/10",
        endDate: "2009/10/10",
      }

      const response = await request(app)
        .put("/api/outbreaks/co/1Z")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(invalidOutbreak)
      expect(response.status).toBe(400)
      expect(response.body.error).toBe(MESSAGES.ENDDATE_BEFORE_STARTDATE)
    })
  })

  describe("DELETE /api/outbreaks/:co", () => {
    test("should not delete an inexistent outbreak", async () => {
      const response = await request(app)
        .delete("/api/outbreaks/INVALID")
        .set("Authorization", `Bearer ${adminToken}`)

      expect(response.status).toBe(404)
      expect(response.body.error).toBe(MESSAGES.OUTBREAK_NOT_FOUND_BY_CODE)
    })

    test("should not delete outbreak when it is linked to a guideline", async () => {
      const virusToDelete = {
        cv: "CC17",
        name: "ToBeDeleted",
      }

      const virusResponse = await request(app)
        .post("/api/viruses")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(virusToDelete)
      expect(virusResponse.status).toBe(201)

      const newZone = { cz: "M2", name: "ToBeDeleted" }
      const zoneResponse = await request(app)
        .post("/api/zones")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(newZone)
      expect(zoneResponse.status).toBe(201)

      const newOutbreak = {
        co: "6P",
        virus: "CC17",
        zone: "M2",
        startDate: "2020/10/10",
      }

      const outbreakResponse = await request(app)
        .post("/api/outbreaks")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(newOutbreak)
      expect(outbreakResponse.status).toBe(201)

      const newGuideline = {
        cg: "11ZZ",
        outbreak: "6P",
        validityPeriod: 10,
      }

      const guidelineResponse = await request(app)
        .post("/api/guidelines")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(newGuideline)
      expect(guidelineResponse.status).toBe(201)

      await Guideline.create()
      const response = await request(app)
        .delete("/api/outbreaks/6P")
        .set("Authorization", `Bearer ${adminToken}`)

      expect(response.status).toBe(400)
      expect(response.body.error).toBe(
        MESSAGES.CANNOT_DELETE_GUIDELINES_ASSOCIATED
      )
    })

    test.skip("should not delete an outbreak without authentication", async () => {
      const response = await request(app).delete("/api/outbreaks/1Z")

      expect(response.status).toBe(403)
      expect(response.body.error).toBe(MESSAGES.AUTH_REQUIRED)
    })

    test("should fail to delete outbreak with employee logged in", async () => {
      const response = await request(app)
        .delete("/api/outbreaks/1Z")
        .set("Authorization", `Bearer ${employeeToken}`)

      expect(response.status).toBe(403)
    })

    test("should delete outbreak", async () => {
      const response = await request(app)
        .delete("/api/outbreaks/1Z")
        .set("Authorization", `Bearer ${adminToken}`)

      expect(response.status).toBe(200)
      expect(response.body.message).toBe(MESSAGES.OUTBREAK_DELETED)
    })

    test("should not find deleted outbreak", async () => {
      const response = await request(app).get("/api/outbreaks/co/1Z")

      expect(response.status).toBe(404)
      expect(response.body.error).toBe(MESSAGES.OUTBREAK_NOT_FOUND_BY_CODE)
    })
  })
  describe("PUT /api/outbreaks/cz/cv/cz:/cv:", () => {
    test("should update an existing outbreak's code", async () => {
      const newOutbreak = {
        co: "7K",
        virus: "CC17",
        zone: "M2",
        startDate: "2010/10/10",
      }

      const response = await request(app)
        .put("/api/outbreaks/cz/cv/M2/CC17")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(newOutbreak)

      expect(response.status).toBe(200)
      expect(response.body.data.co).toBe("7k")
    })

    test("should find outbreak with updated code", async () => {
      const response = await request(app).get("/api/outbreaks/co/7K")

      expect(response.status).toBe(200)
      expect(response.body.data.co).toBe("7k")
    })

    test("should update an existing outbreak's code with employee logged in", async () => {
      const newOutbreak = {
        co: "6L",
        virus: "CC17",
        zone: "M2",
        startDate: "2010/10/10",
      }

      const response = await request(app)
        .put("/api/outbreaks/cz/cv/X7/XX77")
        .set("Authorization", `Bearer ${employeeToken}`)
        .send(newOutbreak)

      expect(response.status).toBe(200)
      expect(response.body.data.co).toBe("6l")
    })

    test("should find outbreak with updated code with employee logged in", async () => {
      const response = await request(app).get("/api/outbreaks/co/6l")

      expect(response.status).toBe(200)
      expect(response.body.data.co).toBe("6l")
    })

    test("should update an existing outbreak's virus", async () => {
      const newOutbreak = {
        co: "7K",
        virus: "VV12",
        zone: "M2",
        startDate: "2010/10/10",
        endDate: "2012/10/10",
      }

      const response = await request(app)
        .put("/api/outbreaks/cz/cv/M2/CC17")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(newOutbreak)

      expect(response.status).toBe(200)
      expect(response.body.data.virus).toBe("vv12")
    })
    test("should find outbreak with updated virus", async () => {
      const response = await request(app).get("/api/outbreaks/co/7K")

      expect(response.status).toBe(200)
      expect(response.body.data.virus).toBe("vv12")
    })

    test("should update an existing outbreak's zone", async () => {
      const newOutbreak = {
        co: "7K",
        virus: "VV12",
        zone: "C2",
        startDate: "2010/10/10",
        endDate: "2012/10/10",
      }

      const response = await request(app)
        .put("/api/outbreaks/cz/cv/M2/VV12")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(newOutbreak)

      expect(response.status).toBe(200)
      expect(response.body.data.zone).toBe("c2")
    })
    test("should find outbreak with updated zone", async () => {
      const response = await request(app).get("/api/outbreaks/co/7K")

      expect(response.status).toBe(200)
      expect(response.body.data.zone).toBe("c2")
    })

    test("should update an existing outbreak's startDate", async () => {
      const newOutbreak = {
        co: "7K",
        virus: "VV12",
        zone: "C2",
        startDate: "2011/10/10",
        endDate: "2012/10/10",
      }

      const response = await request(app)
        .put("/api/outbreaks/cz/cv/C2/VV12")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(newOutbreak)

      expect(response.status).toBe(200)
      expect(response.body.data.startDate).toBe("2011-10-09T23:00:00.000Z")
    })
    test("should find outbreak with updated startDate", async () => {
      const response = await request(app).get("/api/outbreaks/co/7K")

      expect(response.status).toBe(200)
      expect(response.body.data.startDate).toBe("2011-10-09T23:00:00.000Z")
    })

    test("should update an existing outbreak's endDate", async () => {
      const newOutbreak = {
        co: "7K",
        virus: "VV12",
        zone: "C2",
        startDate: "2011/10/10",
        endDate: "2013/10/10",
      }

      const response = await request(app)
        .put("/api/outbreaks/cz/cv/C2/VV12")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(newOutbreak)

      expect(response.status).toBe(200)
      expect(response.body.data.endDate).toBe("2013-10-09T23:00:00.000Z")
    })
    test("should find outbreak with updated startDate", async () => {
      const response = await request(app).get("/api/outbreaks/co/7K")

      expect(response.status).toBe(200)
      expect(response.body.data.endDate).toBe("2013-10-09T23:00:00.000Z")
    })

    test("should return validation error for missing required fields", async () => {
      const invalidOutbreak = { co: "3T" }

      const response = await request(app)
        .put("/api/outbreaks/cz/cv/C2/VV12")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(invalidOutbreak)
      expect(response.status).toBe(400)
      expect(response.body.error).toBe(MESSAGES.MISSING_REQUIRED_FIELDS)
    })

    test("should not fupdate to inexistent virus code", async () => {
      const invalidOutbreak = {
        co: "7K",
        virus: "InvalidVirus",
        zone: "C2",
        startDate: "2011/10/10",
        endDate: "2013/10/10",
      }

      const response = await request(app)
        .put("/api/outbreaks/cz/cv/C2/VV12")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(invalidOutbreak)
      expect(response.status).toBe(404)
      expect(response.body.error).toBe(MESSAGES.VIRUS_NOT_FOUND_BY_CODE)
    })

    test("should not update to inexistent zone code", async () => {
      const invalidOutbreak = {
        co: "7K",
        virus: "VV12",
        zone: "InvalidZone",
        startDate: "2011/10/10",
        endDate: "2013/10/10",
      }

      const response = await request(app)
        .put("/api/outbreaks/cz/cv/C2/VV12")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(invalidOutbreak)
      expect(response.status).toBe(404)
      expect(response.body.error).toBe(MESSAGES.ZONE_NOT_FOUND_BY_CODE)
    })

    test("should not update outbreak to invalid startDate format", async () => {
      const invalidOutbreak = {
        co: "7K",
        virus: "VV12",
        zone: "C2",
        startDate: "abc",
        endDate: "2013/10/10",
      }

      const response = await request(app)
        .put("/api/outbreaks/cz/cv/C2/VV12")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(invalidOutbreak)
      expect(response.status).toBe(400)
      expect(response.body.error).toBe(MESSAGES.INVALID_STARTDATE_FORMAT)
    })

    test("should not update outbreak to invalid endDate format", async () => {
      const invalidOutbreak = {
        co: "1Z",
        virus: "VV12",
        zone: "C2",
        startDate: "2011/10/10",
        endDate: "abc",
      }

      const response = await request(app)
        .put("/api/outbreaks/cz/cv/C2/VV12")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(invalidOutbreak)
      expect(response.status).toBe(400)
      expect(response.body.error).toBe(MESSAGES.INVALID_ENDDATE_FORMAT)
    })

    test("should not update outbreak to future startDate", async () => {
      const invalidOutbreak = {
        co: "1Z",
        virus: "VV12",
        zone: "C2",
        startDate: "2056/10/10",
        endDate: "2013/10/10",
      }

      const response = await request(app)
        .put("/api/outbreaks/cz/cv/C2/VV12")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(invalidOutbreak)
      expect(response.status).toBe(400)
      expect(response.body.error).toBe(MESSAGES.FUTURE_STARTDATE)
    })

    test("should not update outbreak to future startDate", async () => {
      const invalidOutbreak = {
        co: "1Z",
        virus: "VV12",
        zone: "C2",
        startDate: "2011/10/10",
        endDate: "2056/10/10",
      }

      const response = await request(app)
        .put("/api/outbreaks/cz/cv/C2/VV12")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(invalidOutbreak)
      expect(response.status).toBe(400)
      expect(response.body.error).toBe(MESSAGES.FUTURE_ENDDATE)
    })

    test("should not update outbreak because endDate before startDate", async () => {
      const invalidOutbreak = {
        co: "1Z",
        virus: "VV12",
        zone: "C2",
        startDate: "2011/10/10",
        endDate: "2009/10/10",
      }

      const response = await request(app)
        .put("/api/outbreaks/cz/cv/C2/VV12")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(invalidOutbreak)
      expect(response.status).toBe(400)
      expect(response.body.error).toBe(MESSAGES.ENDDATE_BEFORE_STARTDATE)
    })

    test("should not find inexistent virus code", async () => {
      const invalidOutbreak = {
        co: "7K",
        virus: "VV12",
        zone: "C2",
        startDate: "2011/10/10",
        endDate: "2013/10/10",
      }

      const response = await request(app)
        .put("/api/outbreaks/cz/cv/C2/INVALID")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(invalidOutbreak)
      expect(response.status).toBe(404)
      expect(response.body.error).toBe(MESSAGES.VIRUS_SEARCHED_NOT_FOUND)
    })

    test("should not find inexistent zone code", async () => {
      const invalidOutbreak = {
        co: "7K",
        virus: "VV12",
        zone: "C2",
        startDate: "2011/10/10",
        endDate: "2013/10/10",
      }

      const response = await request(app)
        .put("/api/outbreaks/cz/cv/INVALID/VV12")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(invalidOutbreak)
      expect(response.status).toBe(404)
      expect(response.body.error).toBe(MESSAGES.ZONE_SEARCHED_NOT_FOUND)
    })
  })
})
