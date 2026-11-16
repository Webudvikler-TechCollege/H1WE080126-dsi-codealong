import express, { Request, Response } from 'express'
import { carRouter } from './routes/carRouter.js'
import dotenv from 'dotenv'
dotenv.config()
const app = express()
const port = process.env.SERVERPORT || 3000


app.use('/cars',carRouter)

app.get('/', (req: Request, res: Response) => {
    res.send('Hello world')
})

// 404
app.use((req: Request, res: Response) => {
    res.send('404 - Siden blev ikke fundet')
})


app.listen(port, () => {
    console.log(`Server kører på port http://localhost:${port}`)
})