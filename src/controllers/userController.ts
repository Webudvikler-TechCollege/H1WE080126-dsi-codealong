import { Request, Response } from "express"
import bcrypt from 'bcrypt'
import { prisma } from "../prisma.js"

class UserController {
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
}

export const userController = new UserController()