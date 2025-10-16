import rateLimit from "express-rate-limit";

const FIFTEEN_MINUTES = 15 * 60 * 1000;

const MAX_API_REQUESTS = 100;
const MAX_USER_ACTIONS = 20;

const apiLimiter = rateLimit({
  windowMs: FIFTEEN_MINUTES,
  max: MAX_API_REQUESTS,
  message: {
    status: 429,
    message: "Too many requests, please try again later.",
  },
});

const userLimiter = rateLimit({
  windowMs: FIFTEEN_MINUTES,
  max: MAX_USER_ACTIONS,
  message: {
    status: 429,
    message: "Too many requests, please try again later.",
  },
});

export { apiLimiter, userLimiter };
