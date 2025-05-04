const path = require("path");
const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const compression = require("compression");
const cors = require("cors");

const ApiError = require("./utils/ApiError");
const startCronJobs = require("./cronJobs");
const ensureDirectories = require("./utils/createStaticFiles");
const globalErrorHandler = require("./controllers/errorController");
const { telrWebhook } = require("./controllers/accountController");
const mountRoutes = require("./routes");

const app = express();

// app.set("trust proxy", true);
// app.enable("trust proxy");

startCronJobs();
ensureDirectories();

// set security HTTP headers
app.use(helmet());

// Enable CORS
app.use(cors());
app.options("*", cors());
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
});

// Serve static files
app.use(express.static(path.join(__dirname, "uploads")));

// development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// limit requests from same IP
const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  keyGenerator: (req) => req.ip,
  message: "Too many requests from this IP, Please try again in an hour!",
});
app.use("/api", limiter);

// Body parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Data sanitization against NoSQL injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
// app.use(hpp());
app.use(
  hpp({
    whitelist: ["price"],
  })
);

// Compress texts (requests) before sent to client
app.use(compression());

// ROUTES
app.post("/api/v1/telr-webhook", telrWebhook);
mountRoutes(app);

app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find ${req.originalUrl} on server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
