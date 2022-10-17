import express from "express";
import { teamDb } from "../db";
import { Team } from "../types";
const teamRouter = express.Router();

teamRouter.post('/new', async (req, res) => {
    try {
        const teamToInsert = req.body as Team;
        const added = await teamDb.insert({ ...teamToInsert })
        res.send(added)
    } catch (err) {
        res.sendStatus(500).send({ error: err })
    }
})
teamRouter.get('/', async (req, res) => {
    res.send(await teamDb.fetch());
})
teamRouter.delete(`/:id`, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await teamDb.delete(id);
        res.status(200).send(result);
    } catch (e) {
        res.status(500).send(e)
    }
})
teamRouter.patch(`/:id`, async (req, res) => {
    try {
        const { id } = req.params;
        await teamDb.delete(id);
    } catch (e) {
        res.status(500).send(e)
    }
})
teamRouter.get(`/:id/photo`, async (req, res) => {
    try {
        const player = await teamDb.get(req.params.id) as Team | null;
        player?.logo && res.status(200).redirect(player?.logo)
    } catch (e) {
        console.log(e)
        res.status(404).send(null)
    }
})
export default teamRouter;