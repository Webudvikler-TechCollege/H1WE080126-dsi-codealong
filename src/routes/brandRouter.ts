import { Router } from 'express'
import { brandController } from '../controllers/brandController.js'

const router = Router()

router.get('/', brandController.getRecords)
router.get('/:id', brandController.getRecord)
router.post('/', brandController.createRecord)
router.put('/:id', brandController.updateRecord)

export const brandRouter = router