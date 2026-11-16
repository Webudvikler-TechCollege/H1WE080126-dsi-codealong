// Henter Router fra Express
import { Router } from 'express'

// Opretter en router til bilernes endpoints
const router = Router()

// Hjemmelavet liste med biler
const list = {
  "cars": [
    {
      "id": 1,
      "brand": "Volkswagen",
      "model": "Golf",
      "year": 2021,
      "price": 185000
    },
    {
      "id": 2,
      "brand": "Toyota",
      "model": "Corolla",
      "year": 2022,
      "price": 210000
    },
    {
      "id": 3,
      "brand": "BMW",
      "model": "320i",
      "year": 2020,
      "price": 275000
    },
    {
      "id": 4,
      "brand": "Tesla",
      "model": "Model 3",
      "year": 2023,
      "price": 299000
    }
  ]
}

// Returnerer liste, når denne route modtager en GET-request
router.get("/", (_req, res) => {
    // Returnerer listen som JSON
    res.json(list)
})

// Gør routeren tilgængelig i andre filer
export const carRouter = router
