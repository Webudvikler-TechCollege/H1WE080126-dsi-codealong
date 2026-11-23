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
}

export const brandController = new BrandController()