const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

const routes = require("./routes/main");
const {
  notFound,
  globalErrorHandler,
  handleImageUploadError,
} = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 4000;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS setup
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Routes
app.use("/", routes);

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Error handlers
app.use(notFound);
app.use(globalErrorHandler);
app.use(handleImageUploadError);

app.listen(PORT, () => console.log(`JK Notes Server is Running on ${PORT}`));
