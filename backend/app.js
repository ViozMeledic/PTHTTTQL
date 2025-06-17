import 'dotenv/config'
import express from 'express'
import logger from 'morgan'
import cors from 'cors'
import mongoose from 'mongoose'
import routes from './routes/index.js'

const app = express()
const port = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded())
app.use(logger('dev'))

// Router
app.use('/products', routes.productRouter)
app.use('/customers', routes.customerRouter)
app.use('/employees', routes.employeeRouter)
app.use('/invoices', routes.invoiceRouter)
app.use('/statistics', routes.statisticsRouter)
app.use('/login', routes.loginRouter)

app.listen(port, async () => {
    await mongoose.connect(process.env.URL_STRING)
    console.log(`Server listening on port ${port}`)
})