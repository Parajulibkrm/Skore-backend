import express from "express";
import matchRouter from "./matches";
import playerRouter from "./players";
import teamRouter from "./teams";
import tournamentRouter from "./tournaments";
const router = express.Router();

router.use('/tournament', tournamentRouter);
router.use('/player', playerRouter);
router.use('/match', matchRouter);
router.use('/team', teamRouter);
export default router;