// Henter typer fra Express
import { Request, Response } from "express";
// Henter forbindelsen til databasen
import { prisma } from "../prisma.js";

// Samler funktioner til biler
class CarController {

    // Henter alle biler
    getRecords = async (req: Request, res: Response) => {
        try {
            // Henter bilerne fra databasen
            const data = await prisma.car.findMany()
            // Sender bilerne som JSON
            res.json(data)            
        } catch (error) {
            // Viser fejlen i konsollen
            console.error(`Fejl i kald af biler: ${error}`);            
        }        
    }

    // Henter én bil
    getRecord = async (req: Request, res: Response) => {
        // Henter id fra URL'en
        const { id } = req.params;
        try {
            // Finder bilen i databasen
            const data = await prisma.car.findUnique({
                // Laver id om til et tal
                where: { id: Number(id) }
            })
            // Sender bilen som JSON
            res.json(data)            
        } catch (error) {
            // Viser fejlen i konsollen
            console.error(`Fejl i kald af biler: ${error}`);            
        }        
    }
}

// Gør controlleren klar til brug i routeren
export const carController = new CarController
