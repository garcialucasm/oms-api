import express from "express"
import verifyToken from "../../middleware.js"
import OutbreakController from "../controllers/outbreakController.js"

const router = express.Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     Outbreak:
 *       type: object
 *       required:
 *         - co
 *         - virus
 *         - zone
 *         - startDate
 *         - condition
 *       properties:
 *         co:
 *           type: string
 *           description: Outbreak code (1 number followed by 1 letter)
 *         virus:
 *           type: string
 *           description: Virus ID associated with the outbreak
 *         zone:
 *           type: string
 *           description: Zone ID where the outbreak occurred
 *         startDate:
 *           type: string
 *           format: date
 *           description: Start date of the outbreak
 *         endDate:
 *           type: string
 *           format: date
 *           description: End date of the outbreak (if resolved)
 *         condition:
 *           type: string
 *           enum: [active, occurred]
 *           description: Status of the outbreak
 *       example:
 *         co: "1a"
 *         virus: "a1234bcd"
 *         zone: "z5678def"
 *         startDate: "2024-01-01"
 *         endDate: null
 *         condition: "active"
 */

/**
 * @swagger
 * tags:
 *   name: Outbreaks
 *   description: Outbreak management
 */

/**
 * @swagger
 * /api/outbreaks:
 *   post:
 *     summary: Create a new outbreak
 *     tags: [Outbreaks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Outbreak object that needs to be created
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Outbreak'
 */
router.post("/", verifyToken, OutbreakController.create)

/**
 * @swagger
 * /api/outbreaks:
 *   get:
 *     summary: Get all outbreaks
 *     tags: [Outbreaks]
 */
router.get("/", verifyToken, OutbreakController.getAll)

/**
 * @swagger
 * /api/outbreaks/condition/{condition}:
 *   get:
 *     summary: Get all outbreaks by condition
 *     tags: [Outbreaks]
 *     parameters:
 *       - in: path
 *         name: condition
 *         required: true
 *         schema:
 *           type: string
 *           enum: [active, occurred]
 *         description: Condition to filter outbreaks
 */
router.get(
  "/condition/:condition",
  verifyToken,
  OutbreakController.getAllByCondition
)

/**
 * @swagger
 * /api/outbreaks/co/{co}:
 *   get:
 *     summary: Get outbreak by code
 *     tags: [Outbreaks]
 *     parameters:
 *       - in: path
 *         name: co
 *         required: true
 *         schema:
 *           type: string
 *         description: Outbreak code
 */
router.get("/co/:co", verifyToken, OutbreakController.getByCode)

/**
 * @swagger
 * /api/outbreaks/cv/{cv}:
 *   get:
 *     summary: Get outbreaks by virus code
 *     tags: [Outbreaks]
 *     parameters:
 *       - in: path
 *         name: cv
 *         required: true
 *         schema:
 *           type: string
 *         description: Virus code
 */
router.get("/cv/:cv", verifyToken, OutbreakController.getByVirusCode)

/**
 * @swagger
 * /api/outbreaks/cz/{cz}:
 *   get:
 *     summary: Get outbreaks by zone code
 *     tags: [Outbreaks]
 *     parameters:
 *       - in: path
 *         name: cz
 *         required: true
 *         schema:
 *           type: string
 *         description: Zone code
 */
router.get("/cz/:cz", verifyToken, OutbreakController.getByZoneCode)

/**
 * @swagger
 * /api/outbreaks/cc/{cc}:
 *   get:
 *     summary: Get outbreaks by country code
 *     tags: [Outbreaks]
 *     parameters:
 *       - in: path
 *         name: cc
 *         required: true
 *         schema:
 *           type: string
 *         description: Country code
 */

router.get("/cc/:cc", verifyToken, OutbreakController.getByCountryCode)

/**
 * @swagger
 * /api/outbreaks/cv/condition/{cv}/{condition}:
 *   get:
 *     summary: Get outbreaks by virus code and condition
 *     tags: [Outbreaks]
 *     parameters:
 *       - in: path
 *         name: cv
 *         required: true
 *         schema:
 *           type: string
 *         description: Virus code
 *       - in: path
 *         name: condition
 *         required: true
 *         schema:
 *           type: string
 *         description: Condition to filter outbreaks
 *
 */
router.get(
  "/cv/condition/:cv/:condition",
  verifyToken,
  OutbreakController.getByVirusCodeByCondition
)
/**
 * @swagger
 * /api/outbreaks/co/{co}:
 *   put:
 *     summary: Update outbreak by code
 *     tags: [Outbreaks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: co
 *         required: true
 *         schema:
 *           type: string
 *         description: Outbreak code
 */
router.put("/co/:co", verifyToken, OutbreakController.update)

/**
 * @swagger
 * /api/outbreaks/cz/cv/{cz}/{cv}:
 *   put:
 *     summary: Update outbreak by zone and virus code
 *     tags: [Outbreaks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cz
 *         required: true
 *         schema:
 *           type: string
 *         description: Zone code
 *       - in: path
 *         name: cv
 *         required: true
 *         schema:
 *           type: string
 *         description: Virus code
 */
router.put(
  "/cz/cv/:cz/:cv",
  verifyToken,
  OutbreakController.updateByZoneCodeVirusCode
)

/**
 * @swagger
 * /api/outbreaks/{co}:
 *   delete:
 *     summary: Delete outbreak by code
 *     tags: [Outbreaks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: co
 *         required: true
 *         schema:
 *           type: string
 *         description: Outbreak code
 */
router.delete("/:co", verifyToken, OutbreakController.delete)

export { router as outbreakRoutes }
