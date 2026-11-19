// Henter Router fra Express
import { Router } from 'express'
import { carController } from '../controllers/carController.js'

// Opretter en router til bilernes endpoints
const router = Router()

// Returnerer liste, når denne route modtager en GET-request
router.get("/", carController.getRecords)
router.get("/:id", carController.getRecord)

// Gør routeren tilgængelig i andre filer
export const carRouter = router
