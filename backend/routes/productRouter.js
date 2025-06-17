import express from 'express'
import { Product } from '../models/Product.js'
import { getNextId } from '../utils.js'
// import {auth} from '../auth/index.js'

const productRouter = express.Router()
const projectFields = '-_id -__v'

productRouter.get('/', async function (req, res) {
        const orderBy = req.query.orderBy || 'id'
    const products = await Product
            .find()
            .select(projectFields)
            .sort(orderBy)

    res.status(200).json(products)
})

productRouter.get('/:id', async function (req, res) {
    const product = await Product
        .findOne({ id: req.params.id })
        .select(projectFields)

    if (!product) {
        res.status(404).json({
            code: 'notFound',
            message: 'Sản phẩm không tồn tại',
        })
    } else {
        res.status(200).json(product)
    }
})

productRouter.post('/', async function (req, res) {
    const product = req.body
    const products = await Product
        .find()
        .select('id')
        .sort('-id')
        .limit(1)
    let nextId
    if (products.length === 0) {
        nextId = "SP001"
    } else {
        nextId = getNextId(products[0].id)
    }
    await new Product({ id: nextId, ...product }).save();
    res.status(201).json({ id: nextId })
})

productRouter.put('/:id', async function (req, res) {
    const newProduct = req.body
    const result = await Product
        .updateOne(
            { id: req.params.id },
            {
                tenSP: newProduct.tenSP,
                giaBan: Number.parseFloat(newProduct.giaBan),
                soLuong: Number.parseInt(newProduct.soLuong),
            })
    if (result.matchedCount === 0) {
        res.status(404).json({
            code: 'notFound',
            message: 'Sản phẩm không tồn tại',
        })
    } else if (result.modifiedCount === 1) {
        res.status(200).json({
            code: 'OK',
            message: '',
        })
    }
})

productRouter.delete('/:id', async function (req, res) {
    const result = await Product
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
            message: 'Xóa sản phẩm thành công',
        })
    }
})

export default productRouter