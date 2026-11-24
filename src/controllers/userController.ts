import { Request, Response } from "express"
import bcrypt from 'bcrypt'
import { prisma } from "../prisma.js"

class UserController {
    getRecords = async (req: Request, res: Response) => {
        try {
            const data = await prisma.user.findMany({
                omit: {
                    password: true,
                    refreshToken: true
                }
            })
            res.json(data)
        } catch (error) {
            console.error(`Kunne ikke hente brugere: ${error}`);            
        }
    }

    createRecord = async (req: Request, res: Response) => {
        const { password, zipcode, isActive, ...userData } = req.body

        const hashedPassword = await bcrypt.hash(password,10)
        console.log(hashedPassword);
        
        try {
            const data = await prisma.user.create({
                data: {
                    ...userData,
                    zipcode: Number(zipcode),
                    isActive: Boolean(isActive),
                    password: hashedPassword
                }
            })
            res.json(data)
        } catch (error) {
            console.error(`Kunne ikke oprette bruger: ${error}`);
            
        }        
    }

    updateRecord = async (req: Request, res: Response) => {
        const { id } = req.params
        const { password, zipcode, isActive, ...userData } = req.body

        if(typeof password === "string" && password.length > 0) {
            userData.password = await bcrypt.hash(password,10)
        }

        try {
            const data = await prisma.user.update({
                where: { id: Number(id)},
                data: {
                    ...userData,
                    zipcode: Number(zipcode),
                    isActive: Boolean(isActive)
                }
            })
            res.json(data)
        } catch (error) {
            console.error(`Kunne ikke opdatere bruger: ${error}`);
        }

    }
}

export const userController = new UserController()