import { Router } from 'express'
import { authController } from '../controllers/authController.js'
import { userController } from '../controllers/userController.js'
import { Role } from '../generated/prisma/enums.js'

const router = Router()

router.post('/login', authController.authenticate)
router.get('/authorize', authController.authorize, userController.getRecords)
router.get('/role', authController.authorize, authController.requireRole(Role.USER), userController.getRecords)
router.post("/refresh", authController.refreshAccessToken);

export const authRouter = router