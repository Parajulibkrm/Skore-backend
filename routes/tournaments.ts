import express from "express";
import { tournamentDb } from "../db";
import { Tournament } from "../types";
const tournamentRouter = express.Router();

tournamentRouter.post('/new', async (req, res) => {
    try {
        const tournamentToInsert = req.body as Tournament;
        const added = await tournamentDb.insert({ ...tournamentToInsert })
        res.send(added)
    } catch (err) {
        res.sendStatus(500).send({ error: err })
    }
})
tournamentRouter.get('/', async (req, res) => {
    res.send(await tournamentDb.fetch());
})
tournamentRouter.delete(`/:id`, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await tournamentDb.delete(id);
        res.status(200).send(result);
    } catch (e) {
        res.status(500).send(e)
    }
})
tournamentRouter.patch(`/:id`, async (req, res) => {
    try {
        const { id } = req.params;
        await tournamentDb.delete(id);
    } catch (e) {
        res.status(500).send(e)
    }
})
export default tournamentRouter;