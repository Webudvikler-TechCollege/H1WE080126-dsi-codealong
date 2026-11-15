import { Request, Response, Router } from 'express'

const router = Router()

router.get('/', (req: Request, res: Response) => {
    res.send('Velkommen til forsiden af biler')
})

router.get('/sold-cars', (req: Request, res: Response) => {
    res.send('Oversigt over solgte biler')
})

router.get('/:brand/:id', (req: Request, res: Response) => {
    // Destructuring assignment
    const { brand, id } = req.params

    res.send(`${brand}:${id}`);
})


export const carRouter = router