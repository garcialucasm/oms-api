import express from "express"
import verifyToken from "../../middleware.js"
import guidelineController from "../controllers/guidelineController.js"

const router = express.Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     Guideline:
 *       type: object
 *       required:
 *         - cg
 *         - outbreak
 *         - validityPeriod
 *       properties:
 *         cg:
 *           type: string
 *           description: Unique guideline code (2 numbers followed by 2 letters)
 *           example: "12ab"
 *         outbreak:
 *           type: string
 *           description: Outbreak ID associated with the guideline
 *           example: "63f7dceb1b7e3b2d78e49c68"
 *         validityPeriod:
 *           type: number
 *           description: Validity period of the guideline in days
 *           example: 30
 *         isExpired:
 *           type: boolean
 *           description: Whether the guideline is expired
 *           example: false
 */

/**
 * @swagger
 * tags:
 *   name: Guidelines
 */

/**
 * @swagger
 * /api/guidelines:
 *   post:
 *     summary: Create a new guideline
 *     tags: [Guidelines]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Guideline'
 */
router.post("/", verifyToken, guidelineController.createGuideline)

/**
 * @swagger
 * /api/guidelines:
 *   get:
 *     summary: Get all guidelines
 *     tags: [Guidelines]
 */
router.get("/", verifyToken, guidelineController.getAllGuidelines)

/**
 * @swagger
 * /api/guidelines/cg/{cg}:
 *   get:
 *     summary: Get a guideline by its code
 *     tags: [Guidelines]
 *     parameters:
 *       - name: cg
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The guideline code
 */
router.get("/cg/:cg", verifyToken, guidelineController.getGuidelinesByCode)

/**
 * @swagger
 * /api/guidelines/status/{status}:
 *   get:
 *     summary: Get guidelines by status
 *     tags: [Guidelines]
 *     parameters:
 *       - name: status
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The status of the guidelines (e.g., active, inactive)
 */
router.get(
  "/status/:status",
  verifyToken,
  guidelineController.getGuidelinesByStatus
)

/**
 * @swagger
 * /api/guidelines/cc/cv/{cc}/{cv}:
 *   get:
 *     summary: Get guidelines by country and virus
 *     tags: [Guidelines]
 *     parameters:
 *       - name: cc
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The country code
 *       - name: cv
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The virus code
 */
router.get(
  "/cc/cv/:cc/:cv",
  verifyToken,
  guidelineController.getGuidelinesByCountryAndVirus
)

/**
 * @swagger
 * /api/guidelines/{cg}:
 *   put:
 *     summary: Update a guideline by code
 *     tags: [Guidelines]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: cg
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The guideline code
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               outbreak:
 *                 type: string
 *                 description: Outbreak ID
 *               validityPeriod:
 *                 type: number
 *                 description: Validity period in days
 */
router.put("/:cg", verifyToken, guidelineController.updateGuidelineByCode)

/**
 * @swagger
 * /api/guidelines/expired/{cg}:
 *   delete:
 *     summary: Delete an expired guideline by code
 *     tags: [Guidelines]
 *     parameters:
 *       - name: cg
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The guideline code
 */
router.delete(
  "/expired/:cg",
  verifyToken,
  guidelineController.deleteExpiredGuidelineByCode
)

/**
 * @swagger
 * /api/guidelines/{cg}:
 *   delete:
 *     summary: Delete a guideline by code
 *     tags: [Guidelines]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: cg
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The guideline code
 */
router.delete("/:cg", verifyToken, guidelineController.deleteGuidelineByCode)

export { router as guidelineRoutes }
