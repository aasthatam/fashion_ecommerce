import express from "express";
import { getBehaviorStats } from "../controllers/analyticsController.js";

const analyticsRouter = express.Router();

analyticsRouter.get("/behavior", getBehaviorStats);

export default analyticsRouter;
