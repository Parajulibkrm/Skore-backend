import express from "express";
import { playerDb } from "../db";
import { Player } from "../types";
const playerRouter = express.Router();

playerRouter.post('/new', async (req, res) => {
    try {
        const playerToInsert = req.body as Player;
        const added = await playerDb.insert({ ...playerToInsert })
        res.send(added)
    } catch (err) {
        res.sendStatus(500).send({ error: err })
    }
})
playerRouter.get('/', async (req, res) => {
    res.send(await playerDb.fetch());
})
playerRouter.delete(`/:id`, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await playerDb.delete(id);
        res.status(200).send(result);
    } catch (e) {
        res.status(500).send(e)
    }
})
playerRouter.patch(`/:id`, async (req, res) => {
    try {
        const { id } = req.params;
        await playerDb.delete(id);
    } catch (e) {
        res.status(500).send(e)
    }
})

playerRouter.get(`/:id/photo`, async (req, res) => {
    try {
        const player = await playerDb.get(req.params.id) as Player | null;
        player?.photoUrl && res.status(200).redirect(player?.photoUrl)
    } catch (e) {
        console.log(e)
        res.status(404).send(null)
    }
})
export default playerRouter;