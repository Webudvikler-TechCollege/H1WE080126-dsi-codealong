import express, { Request, Response } from 'express'
import { carRouter } from './routes/carRouter.js'
const app = express()

app.use('/cars',carRouter)

/*
app.get('/', (req: Request, res: Response) => {
    res.send('Hello world')
})

app.get('/about', (req: Request, res: Response) => {
    res.send('<h1>Om os</h1>')
})
*/
// 404
app.use((req: Request, res: Response) => {
    res.send('404 - Siden blev ikke fundet')
})


app.listen(4242, () => {
    console.log(`Server kører på port http://localhost:4242`)
})