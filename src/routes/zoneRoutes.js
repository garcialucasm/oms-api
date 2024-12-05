import express from "express"
import verifyToken from "../../middleware.js"
import zoneController from "../controllers/zoneController.js"

const router = express.Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     Zone:
 *       type: object
 *       required:
 *         - cz
 *         - name
 *       properties:
 *         cz:
 *           type: string
 *           description: Unique zone code (1 letter followed by 1 number)
 *           example: "a1"
 *         name:
 *           type: string
 *           description: The name of the zone
 *           example: "north zone"
 */

/**
 * @swagger
 * tags:
 *   name: Zones
 */

/**
 * @swagger
 * /api/zones:
 *   post:
 *     summary: Create a new zone
 *     tags: [Zones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Zone'
 */
router.post("/", verifyToken, zoneController.createZone)

/**
 * @swagger
 * /api/zones:
 *   get:
 *     summary: Get all zones
 *     tags: [Zones]
 */
router.get("/", verifyToken, zoneController.getAllZones)

/**
 * @swagger
 * /api/zones/name/{name}:
 *   get:
 *     summary: Get a zone by its name
 *     tags: [Zones]
 *     parameters:
 *       - name: name
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the zone
 */
router.get("/name/:name", verifyToken, zoneController.getZonesByName)

/**
 * @swagger
 * /api/zones/cz/{cz}:
 *   get:
 *     summary: Get a zone by its code
 *     tags: [Zones]
 *     parameters:
 *       - name: cz
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The zone code (1 letter and 1 number)
 */
router.get("/cz/:cz", verifyToken, zoneController.getZonesByCode)

/**
 * @swagger
 * /api/zones/{cz}:
 *   put:
 *     summary: Update a zone by code
 *     tags: [Zones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: cz
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The zone code (1 letter and 1 number)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Zone'
 */
router.put("/:cz", verifyToken, zoneController.updateZoneByCode)

/**
 * @swagger
 * /api/zones/{cz}:
 *   delete:
 *     summary: Delete a zone by code
 *     tags: [Zones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: cz
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The zone code (1 letter and 1 number)
 */
router.delete("/:cz", verifyToken, zoneController.deleteZoneByCode)

export { router as zoneRoutes }
