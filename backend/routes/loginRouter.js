import express from 'express'
import {validateUser} from '../auth/index.js'

const loginRouter = express.Router()

loginRouter.post('/', validateUser)

export default loginRouter
