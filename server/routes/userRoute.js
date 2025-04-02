import express from 'express'
import { createUser,bookVisit,allBookings, cancelBooking } from '../controllers/userCntrl.js'

const router =express.Router()

router.post('/register', createUser)
router.post('/bookVisit/:id', bookVisit)
router.post('/allBookings', allBookings)
router.post('/removeBooking/:id',cancelBooking)


export {router as userRoute}