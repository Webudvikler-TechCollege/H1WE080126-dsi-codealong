import { Router } from 'express'
import { userController } from '../controllers/userController.js'

const router = Router()

router.get('/', userController.getRecords)
router.put('/:id', userController.updateRecord)
router.post('/', userController.createRecord)

export const userRouter = router