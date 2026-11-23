import { Request, Response } from "express"
import { prisma } from "../prisma.js"

class BrandController {
    getRecords = async (req: Request, res: Response) => {
        try {
            const data = await prisma.brand.findMany()
            return res.json(data)
        } catch (error) {
            console.error(`Fejl i kald af brands: ${error}`)
        }
    }

    createRecord = async (req: Request, res: Response) => {
        const { title, logo} = req.body;
        
        if(!title || !logo) {
            res.send('Alle felter skal være udfyldt')
        }

        try {
            const data = await prisma.brand.create({
                data: {
                    title: title,
                    logo: logo
                }
            })
            res.json(data)
        } catch (error) {
            console.error(`Fejl: Kunne ikke oprette brand: ${error}`)
        }
        
    }
}

export const brandController = new BrandController()