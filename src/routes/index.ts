import { Router } from "express";
import userRoutes from "./user.routes";
import authRoutes from "./auth.routes";
import placeRoutes from "./place.routes";
import universalRoutes from "./universal.routes";
const routers = Router();

routers.use("/users", userRoutes);

routers.use("/auth", authRoutes);

routers.use("/places", placeRoutes);

routers.use("/u/0", universalRoutes);

export default routers;
