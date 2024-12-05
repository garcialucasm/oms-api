import express from "express"

import verifyToken from "../../middleware.js"
import CountryController from "../controllers/countryController.js"

const router = express.Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     Country:
 *       type: object
 *       required:
 *         - name
 *         - zone
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the country
 *         zone:
 *           type: string
 *           description: The zone of the country
 *       example:
 *         name: Portugal
 *         zone: A1
 */

/**
 * @swagger
 * tags:
 *   name: Countries
 *   description: API for managing countries
 */

/**
 * @swagger
 * /api/countries:
 *   post:
 *     summary: Create a new country
 *     tags: [Countries]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Country'
 */
router.post("/", verifyToken, CountryController.create)

/**
 * @swagger
 * /api/countries:
 *   get:
 *     summary: Retrieve all countries
 *     tags: [Countries]
 */
router.get("/", verifyToken, CountryController.getAll)

/**
 * @swagger
 * /api/countries/cc/{cc}:
 *   get:
 *     summary: Retrieve a country by its code
 *     tags: [Countries]
 *     parameters:
 *       - in: path
 *         name: cc
 *         schema:
 *           type: string
 *         required: true
 *         description: The country code
 */
router.get("/cc/:cc", verifyToken, CountryController.getByCode)

/**
 * @swagger
 * /api/countries/name/{name}:
 *   get:
 *     summary: Retrieve a country by its name
 *     tags: [Countries]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: The country name
 */
router.get("/name/:name", verifyToken, CountryController.getByName)

/**
 * @swagger
 * /api/countries/cc/info/{cc}:
 *   get:
 *     summary: Retrieve all information about a country by its code
 *     tags: [Countries]
 *     parameters:
 *       - in: path
 *         name: cc
 *         schema:
 *           type: string
 *         required: true
 *         description: The country code
 */
router.get("/cc/info/:cc", verifyToken, CountryController.getAllInfo)

/**
 * @swagger
 * /api/countries/cc/{cc}:
 *   put:
 *     summary: Update a country by its code
 *     tags: [Countries]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cc
 *         schema:
 *           type: string
 *         required: true
 *         description: The country code
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Country'
 */
router.put("/cc/:cc", verifyToken, CountryController.update)

/**
 * @swagger
 * /api/countries/cc/{cc}:
 *   delete:
 *     summary: Delete a country by its code
 *     tags: [Countries]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cc
 *         schema:
 *           type: string
 *         required: true
 *         description: The country code
 */
router.delete("/cc/:cc", verifyToken, CountryController.delete)

export { router as countryRoutes }
