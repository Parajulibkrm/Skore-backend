import express from "express";
import { pusher } from "..";
import { matchDb, playerDb, teamDb, tournamentDb } from "../db";
import { Event, Match } from "../types";
const matchRouter = express.Router();

matchRouter.post('/new', async (req, res) => {
    try {
        const matchToInsert = req.body as Match;
        if (matchToInsert.teams.length !== 2) return res.status(400).send({ error: { message: 'Please Select Two teams for the match' } })
        const teams = await Promise.all([teamDb.get(matchToInsert.teams[0]), teamDb.get(matchToInsert.teams[1])])
        if (teams.includes(null)) {
            return res.status(400).send({ error: { message: 'Please enter Valid teams for the match' } })
        }
        const tournament = matchToInsert.tournament ? await tournamentDb.get(matchToInsert.tournament) : null
        const added = await matchDb.insert({ ...matchToInsert, teams: teams, tournament })
        res.send(added)
    } catch (err) {
        console.log(err)
        res.status(500).send({ error: err })
    }
})
matchRouter.get('/', async (req, res) => {
    const query = req.query;
    res.send(await matchDb.fetch(query));
})
matchRouter.get('/:id', async (req, res) => {
    const { id } = req.params
    res.send(await matchDb.get(id));
})
matchRouter.delete(`/:id`, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await matchDb.delete(id);
        res.status(200).send(result);
    } catch (e) {
        res.status(500).send(e)
    }
})
matchRouter.patch(`/:id`, async (req, res) => {
    try {
        const { id } = req.params;
        await matchDb.delete(id);
    } catch (e) {
        res.status(500).send(e)
    }
})
export default matchRouter;