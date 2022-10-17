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

matchRouter.post('/:id/event', async (req, res) => {
    try {
        const { id } = req.params;
        const eventToInsert = req.body as Event;
        // trigger live event for the match
        pusher.trigger(`cache-${id}`, 'events', eventToInsert);
        const isGoal = eventToInsert.type === 'GOAL' || eventToInsert.type === 'PENALTY'
        const updatePayload: any = { events: matchDb.util.append([{ ...eventToInsert }]) }
        if (isGoal) {
            const player1 = await playerDb.get(eventToInsert.player1 || '');
            const player2 = await playerDb.get(eventToInsert.player2 || '')
            updatePayload.goals = matchDb.util.append([{ player: player1, assist: player2, timeStamp: Date.now(), matchTimeStamp: eventToInsert.matchTimeStamp, team: eventToInsert.team1 }])
        }
        await matchDb.update(updatePayload, id)
        const match = await matchDb.get(id);
        // emit latest goal updates and match state
        pusher.trigger(`cache-state-${id}`, 'state', { goals: match?.goals || [], updated: eventToInsert.matchTimeStamp, status: match?.status })
        res.status(200).send({ match })
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