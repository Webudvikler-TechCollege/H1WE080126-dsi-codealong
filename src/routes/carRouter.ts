// Henter Router fra Express
import { Router } from 'express'
// Henter controlleren til biler
import { carController } from '../controllers/carController.js'

// Opretter en router til bilernes endpoints
const router = Router()

// Henter alle biler
router.get("/", carController.getRecords)
// Henter én bil ud fra id
router.get("/:id", carController.getRecord)
// Kalder metoden til at oprette en bil
router.post("/", carController.createRecord)

// Gør routeren tilgængelig i andre filer
export const carRouter = router
