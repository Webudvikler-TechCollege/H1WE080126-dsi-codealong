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

    getRecord = async (req: Request, res: Response) => {
        const { id } = req.params;
        
        try {
            const data = await prisma.brand.findUnique({
                where: { id: Number(id) }
            })
            res.json(data)
        } catch (error) {
            console.error(`Fejl i kald af brand: ${error}`)
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

    updateRecord = async (req: Request, res: Response) => {
        const { id } = req.params
        const { title, logo } = req.body

        if(!id) {
            res.send('Ugyldigt id')
        }

        if(!title || !logo) {
            res.send('Alle felter skal udfyldes')
        }        
        
        try {
            const data = await prisma.brand.update({
                where: { id: Number(id)},
                data: {
                    title: title,
                    logo: logo
                }
            })
            res.json(data)
        } catch (error) {
            console.error(`Fejl: Kan ikke opdater brand: ${error}`)
        }
        
        
    }
}

export const brandController = new BrandController()