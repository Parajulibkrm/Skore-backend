import express from "express";
import teamRouter from './teams.ts'
const router = express.Router();

router.use('/team', teamRouter);
export default router;