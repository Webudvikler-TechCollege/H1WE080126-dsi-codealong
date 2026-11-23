// Henter Express og typer til requests og responses
import express, { Request, Response } from "express";
// Henter dotenv, som indlæser variabler fra .env
import dotenv from 'dotenv'
// Henter routeren til biler
import { carRouter } from "./routes/carRouter.js";
import { prisma } from "./prisma.js";
import { brandRouter } from "./routes/brandRouter.js";

// Indlæser variablerne fra .env
dotenv.config()
// Bruger porten fra .env eller 3000, hvis SERVERPORT mangler
const port = process.env.SERVERPORT ?? 3000

// Opretter Express-appen
const app = express()
app.use(express.urlencoded({extended: true}))

// Viser en velkomstbesked på forsiden
app.get("/", (req: Request, res: Response) => {
    res.send('Velkomment til everide')
})

// Sender requests til /cars videre til bilernes router
app.use('/cars', carRouter)
app.use('/brands', brandRouter)

// Viser en besked, hvis ingen route matcher adressen
app.use((req: Request, res: Response) => {
    res.send('404: Siden blev ikke fundet')
})

// Starter serveren på den valgte port
app.listen(port, () => {
    console.log(`Server kører på adresse http://localhost:${port}`);    
})


