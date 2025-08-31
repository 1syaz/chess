import "./config/passportSetup";
import express from "express";
import helmet from "helmet";
import userRouter from "./routes/userRoute";
import cookieParser from "cookie-parser";
import passport from "passport";
import http from "http";
import { errorMiddleware } from "./middleware/errorMiddleware";
import { initWebSocketServer } from "./websocket-utils/initWebSocketServer";

const app = express();

// middleware
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// routes
app.use("/api/v1/users", userRouter);

app.use(errorMiddleware);

const server = http.createServer(app);

// init websocket
initWebSocketServer(server);

export default server;
