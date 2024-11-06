const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const routes = require("./routes/main");
const { notFound, globalErrorHandler } = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 4000;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS setup
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Routes
app.use("/api", routes);

// Error handlers
app.use(notFound);
app.use(globalErrorHandler);

app.listen(PORT, () => console.log(`JK Notes Server is Running on ${PORT}`));
