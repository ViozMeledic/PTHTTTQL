import express from 'express'
import { Customer } from '../models/Customer.js'
import { getNextId } from '../utils.js'
// import {auth} from '../auth/index.js'

const customerRouter = express.Router()
const projectFields = '-_id -__v'

customerRouter.get('/', async function (req, res) {
    const orderBy = req.query.orderBy || 'id'
    const customers = await Customer
            .find()
            .select(projectFields)
            .sort(orderBy)

    res.status(200).json(customers)
})

customerRouter.get('/:id', async function (req, res) {
    const customer = await Customer
        .findOne({ id: req.params.id })
        .select(projectFields)

    if (!customer) {
        res.status(404).json({
            code: 'notFound',
            message: 'Khách hàng không tồn tại',
        })
    } else {
        res.status(200).json(customer)
    }
})

customerRouter.post('/', async function (req, res) {
    const customer = req.body
    const customers = await Customer
        .find()
        .select('id')
        .sort('-id')
        .limit(1)
    let nextId
    if (customers.length === 0) {
        nextId = "KH001"
    } else {
        nextId = getNextId(customers[0].id)
    }
    await new Customer({ id: nextId, ...customer }).save();
    res.status(201).json({ id: nextId })
})

customerRouter.put('/:id', async function (req, res) {
    const newCustomer = req.body
    const result = await Customer
        .updateOne(
            { id: req.params.id },
            {
                tenKH: newCustomer.tenKH,
                sdt: newCustomer.sdt,
                email: newCustomer.email,
                ngaySinh: new Date(newCustomer.ngaySinh),
            })
    if (result.matchedCount === 0) {
        res.status(404).json({
            code: 'notFound',
            message: 'Khách hàng không tồn tại'
        })
    } else if (result.modifiedCount === 1) {
        res.status(200).json({
            code: 'OK',
            message: '',
        })
    }
})

customerRouter.delete('/:id', async function (req, res) {
    const result = await Customer
        .findOne({ id: req.params.id })
        .deleteOne()
    if (result.deletedCount === 0) {
        res.status(404).json({
            code: 'notFound',
            message: '',
        })
    } else {
        res.status(204).json({
            code: 'noContent',
            message: 'Xóa khách hàng thành công',
        })
    }
})

export default customerRouter