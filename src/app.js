import express from "express";
import morgan from "morgan";
import notFound from "./common/middleware/notFound.js";
import errorHandler from "./common/middleware/errorHandler.js";
import successResponse from "./common/utils/sucessResponse.js";
import cookieParser from "cookie-parser";
import corsConfig from "./config/corsConfig.js";
import routes from "./routes.js";
import { connectRedis } from "./config/redis.js";
import redis from "./config/redis.js";
import connectToMongoDB from "./config/db.js";

const app = express();

// const startServer = async () => {
//   try {
//     await connectRedis();
//     console.log("🚀 Redis ready");
//   } catch (err) {
//     console.error("❌ Redis connection failed", err);
//   }
// };

// startServer();

connectToMongoDB();

app.use(morgan("dev"));
app.use(corsConfig);
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", routes);

app.get("/", (req, res) => {
  successResponse(res, {}, "API IS WOKING");
});

// app.get("/redis-check", async (req, res, next) => {
//   try {
//     await redis.set("foo", "bar");
//     const result = await redis.get("foo");

//     successResponse(res, { redisValue: result }, "Redis is working ✅");
//   } catch (error) {
//     next(error);
//   }
// });

app.use(notFound);
app.use(errorHandler);

export default app;
