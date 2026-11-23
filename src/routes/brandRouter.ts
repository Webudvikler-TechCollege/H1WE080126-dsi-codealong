import { Router } from 'express'
import { brandController } from '../controllers/brandController.js'

const router = Router()

router.get('/', brandController.getRecords)
router.post('/', brandController.createRecord)

export const brandRouter = router