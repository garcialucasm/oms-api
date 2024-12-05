import express from "express"
import verifyToken from "../../middleware.js"
import guidelineController from "../controllers/guidelineController.js"

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Guidelines
 *   description: API for managing guidelines
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
 *             type: object
 *             properties:
 *               cg:
 *                 type: string
 *                 description: The unique guideline code
 *               outbreak:
 *                 type: string
 *                 description: Outbreak ID associated with the guideline
 *               validityPeriod:
 *                 type: number
 *                 description: Validity period of the guideline in days
 *     responses:
 *       201:
 *         description: Guideline created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post("/", verifyToken, guidelineController.createGuideline)

/**
 * @swagger
 * /api/guidelines:
 *   get:
 *     summary: Get all guidelines
 *     tags: [Guidelines]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of guidelines retrieved
 *       404:
 *         description: No guidelines found
 *       500:
 *         description: Failed to retrieve guidelines
 */
router.get("/", verifyToken, guidelineController.getAllGuidelines)

/**
 * @swagger
 * /api/guidelines/cg/{cg}:
 *   get:
 *     summary: Get a guideline by its code
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
 *     responses:
 *       200:
 *         description: Guideline retrieved
 *       404:
 *         description: Guideline not found
 *       500:
 *         description: Failed to retrieve the guideline
 */
router.get("/cg/:cg", verifyToken, guidelineController.getGuidelinesByCode)

/**
 * @swagger
 * /api/guidelines/status/{status}:
 *   get:
 *     summary: Get guidelines by status
 *     tags: [Guidelines]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: status
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The status of the guidelines (e.g., active, inactive)
 *     responses:
 *       200:
 *         description: Guidelines retrieved
 *       404:
 *         description: No guidelines found
 *       500:
 *         description: Failed to retrieve guidelines
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
 *     security:
 *       - bearerAuth: []
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
 *     responses:
 *       200:
 *         description: Guidelines retrieved
 *       404:
 *         description: No guidelines found
 *       500:
 *         description: Failed to retrieve guidelines
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
 *     responses:
 *       200:
 *         description: Guideline updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Guideline not found
 *       500:
 *         description: Internal server error
 */
router.put("/:cg", verifyToken, guidelineController.updateGuidelineByCode)

/**
 * @swagger
 * /api/guidelines/expired/{cg}:
 *   delete:
 *     summary: Delete an expired guideline by code
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
 *     responses:
 *       200:
 *         description: Guideline deleted successfully
 *       400:
 *         description: Guideline not found or not expired
 *       500:
 *         description: Internal server error
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
 *     responses:
 *       200:
 *         description: Guideline deleted successfully
 *       404:
 *         description: Guideline not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:cg", verifyToken, guidelineController.deleteGuidelineByCode)

export { router as guidelineRoutes }
