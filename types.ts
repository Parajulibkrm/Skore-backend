// Tournament > Matches
// Match > Select Teams 
// Create Team 
// Create Player - name,
//     Team has players
// Match - date, title, desc, venue, status
//     - Teams - players, title, logo
//     - Events - type, player1, player2, timestamp
export interface Player {
    key?: string;
    name: string;
    photoUrl?: string;
}

export interface Team {
    key?: string;
    name: string;
    logo?: string;
}
export interface Tournament {
    key?: string;
    title: string;
    logo: string;
}
export interface Match {
    key?: string;
    title: string;
    tournament?: string;
    desc: string;
    venue: string;
    time: number;
    status: 'SCHEDULED' | 'STARTED' | 'CANCELED' | 'POSTPONED' | 'PAUSED' | 'ENDED';
    events: string[];
    teams: string[];
    goals: [{ player: Player, assist: Player, timeStamp: number, matchTimeStamp: number, team: string }]
}
export interface Event {
    type: string;
    comment: string;
    timeStamp: string;
    matchTimeStamp: string;
    player1?: string;
    player2?: string;
    team1?: string;
    team2?: string;
}

export type Partial<T> = {
    [P in keyof T]?: T[P];
};