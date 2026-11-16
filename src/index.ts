import express, { Request, Response } from 'express'
import { carRouter } from './routes/carRouter.js'
import dotenv from 'dotenv'
import { prisma } from './prisma.js'
dotenv.config()
const app = express()
const port = process.env.SERVERPORT || 3000


app.get('/', async (req: Request, res: Response) => {
    const data = await prisma.user.findMany()
    console.log(data);
    
    res.send('Hello world') 
})

app.use('/cars',carRouter)

// 404
app.use((req: Request, res: Response) => {
    res.send('404 - Siden blev ikke fundet')
})


app.listen(port, () => {
    console.log(`Server kører på port http://localhost:${port}`)
})