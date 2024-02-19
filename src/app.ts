import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import { ApiResponse } from "./utils/ApiResponse";
import passport from "passport";
import routers from "./routes";
import "./strategy/local.strategy";
import { ApiError } from "./utils/ApiError";
import MongoStore from "connect-mongo";
const app = express();
import compression = require("compression");
import ErrorHandlerMiddleware from "./middlewares/errorhandler.middleware";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(
  cors({
    origin: process.env.CORS_URL,
    credentials: true,
  }),
);
app.use(compression());
app.use(cookieParser(process.env.COOKIE_SECRECT));
app.use(
  session({
    secret: process.env.SESSION_SECRECT!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 10 * 60000,
      signed: true,
    },
    store: MongoStore.create({
      mongoUrl: `${process.env.DATABASE_URL}/${process.env.DATABASE_NAME}`,
      touchAfter: 24 * 3600,
      autoRemove: "interval",
      autoRemoveInterval: 10, // In minutes. Default
    }),
  }),
);
app.use(passport.initialize());
app.use(passport.session());
app.use("/api/v1", routers);
app.get('/',(req,res)=>{
  res.sendStatus(200)
})
app.get("/health-check", (req, res) => {
  res.status(200).json(new ApiResponse<null>(200, "server is up!!"));
});
app.all('*', (req, res,next) => next(new ApiError(400,"Resource not found")))
app.use(ErrorHandlerMiddleware);





export { app };
