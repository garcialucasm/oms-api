import swaggerJsDoc from "swagger-jsdoc"
import swaggerUi from "swagger-ui-express"

const port = process.env.PORT || 3000

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "OMS API Documentation",
      version: "1.3.0",
      description: "API documentation for OMS application",
    },
    servers: [
      {
        url: `http://localhost:${port | 3000}`,
        description: "Local development server",
      },
    ],
  },
  apis: ["./src/routes/*.js"], // Path to your route files
}

const specs = swaggerJsDoc(swaggerOptions)

export { swaggerUi, specs }
