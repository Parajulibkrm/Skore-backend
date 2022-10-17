import express from 'express'
import bodyParser from 'body-parser'
import Pusher from 'pusher'

import * as dotenv from 'dotenv'
// import router from './routes/routes'
dotenv.config()
const app = express()


const PORT = process.env.PORT || 5000
export const pusher = new Pusher({
    appId: process.env.app_id as string,
    key: process.env.key as string,
    secret: process.env.secret as string,
    cluster: process.env.cluster || 'ap2'
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use((_, res, next) => {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*')
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
    next()
})


app.get('/', (_, res) => {
    res.send({ 'test': 'success' })
});
// app.use(router)
app.listen(PORT, () => {
    console.log('Node app is running on PORT', PORT)
})