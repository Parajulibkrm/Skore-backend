import { Deta } from 'deta'; // import Deta

import * as dotenv from 'dotenv'
dotenv.config()

// Initialize with a Project Key
const deta = Deta(process.env.DETA_PROJECT_KEY as string);

export const playerDb = deta.Base('players');
export const teamDb = deta.Base('teams');
export const matchDb = deta.Base('matches');
export const tournamentDb = deta.Base('tournaments');