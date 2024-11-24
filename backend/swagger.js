const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "JK Notes API Documentation",
      version: "1.0.0",
      description: "API documentation for JK Notes mobile application",
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: "http://localhost:4000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token in the format: Bearer <token>",
        },
      },
      schemas: {
        Error: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "Error message",
            },
            code: {
              type: "string",
              description: "Error code",
            },
          },
        },
        SuccessResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "Success message",
            },
          },
        },
      },
    },
    tags: [
      {
        name: "Auth",
        description: "Authentication endpoints",
      },
      {
        name: "Notes",
        description: "Note management endpoints",
      },
      {
        name: "Profile",
        description: "User profile management",
      },
    ],
  },
  apis: ["./routes/*.js", "./controllers/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
