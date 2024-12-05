import express from "express"
import verifyToken from "../../middleware.js"
import VirusController from "../controllers/virusController.js"

/**
 * @swagger
 * components:
 *   schemas:
 *     Virus:
 *       type: object
 *       required:
 *         - cv
 *         - name
 *       properties:
 *         cv:
 *           type: string
 *           description: Unique virus code (2 letters followed by 2 numbers)
 *           example: ab12
 *         name:
 *           type: string
 *           description: Name of the virus
 *           example: gripe
 */

/**
 * @swagger
 * tags:
 *   name: Viruses
 *   description: API endpoints related to viruses
 */

const router = express.Router()

/**
 * @swagger
 * /viruses:
 *   post:
 *     summary: Create a new virus
 *     tags: [Viruses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Virus'
 */
router.post("/", verifyToken, VirusController.create)

/**
 * @swagger
 * /viruses:
 *   get:
 *     summary: Retrieve all viruses
 *     tags: [Viruses]
 */
router.get("/", verifyToken, VirusController.getAll)
/**
 * @swagger
 * /viruses/name/{name}:
 *   get:
 *     summary: Retrieve a virus by its name
 *     tags: [Viruses]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: The virus name.
 */
router.get("/name/:name", verifyToken, VirusController.getByName)

/**
 * @swagger
 * /viruses/cv/{cv}:
 *   get:
 *     summary: Retrieve a virus by its code
 *     tags: [Viruses]
 *     parameters:
 *       - in: path
 *         name: cv
 *         schema:
 *           type: string
 *         required: true
 *         description: The virus code (2 letters followed by 2 numbers).
 */
router.get("/cv/:cv", verifyToken, VirusController.getByCode)

/**
 * @swagger
 * /viruses/{cv}:
 *   put:
 *     summary: Update a virus by its code
 *     tags: [Viruses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cv
 *         schema:
 *           type: string
 *         required: true
 *         description: The virus code (2 letters followed by 2 numbers).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Updated virus name.
 *                 example: influenza
 */
router.put("/:cv", verifyToken, VirusController.update)

/**
 * @swagger
 * /viruses/{cv}:
 *   delete:
 *     summary: Delete a virus by its code
 *     tags: [Viruses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cv
 *         schema:
 *           type: string
 *         required: true
 *         description: The virus code (2 letters followed by 2 numbers).
 */
router.delete("/:cv", verifyToken, VirusController.delete)

export { router as virusRoutes }
