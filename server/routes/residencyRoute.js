import express from 'express'
import { createResidency } from '../controllers/rsedCntrl.js'

const router =express.Router()

router.post('/create', createResidency)


export {router as residencyRoute}