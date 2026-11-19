import { Request, Response } from "express";
import { prisma } from "../prisma.js";

class CarController {
    getRecords = async (req: Request, res: Response) => {
        try {
            const data = await prisma.car.findMany()
            res.json(data)            
        } catch (error) {
            console.error(`Fejl i kald af biler: ${error}`);            
        }        
    }

    getRecord = async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            const data = await prisma.car.findUnique({
                where: { id: Number(id) }
            })
            res.json(data)            
        } catch (error) {
            console.error(`Fejl i kald af biler: ${error}`);            
        }        
    }
}

export const carController = new CarController