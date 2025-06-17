import express from 'express'
import { Invoice } from '../models/Invoice.js'
import { Customer } from '../models/Customer.js'
import { Payment } from '../models/Payment.js'
import { ProductInvoice } from '../models/ProductInvoice.js'
import { Product } from '../models/Product.js'
import { getNextId } from '../utils.js'

const invoiceRouter = express.Router()
const projectFields = '-_id -__v'

invoiceRouter.get('/', async function (req, res) {
    const orderBy = req.query.orderBy || 'id'
    let invoices = await Invoice.aggregate([
        {
            $project: {
                _id: 0,
                id: 1,
                tongTien: 1,
                ngayTao: 1,
            }
        },
        {
            $lookup: {
                from: 'tblSanPham-HoaDon',
                localField: 'id',
                foreignField: 'tblHoaDonid',
                pipeline: [{ $project: { _id: 0, id: '$tblSanPhamid', soLuong: 1 } }],
                as: 'sanPham1'
            },
        },
        {
            $lookup: {
                from: 'tblSanPham',
                localField: 'sanPham1.id',
                foreignField: 'id',
                pipeline: [{ $project: { _id: 0, tenSP: 1, giaBan: 1 } }],
                as: 'sanPham2'
            }
        },
    ])

    invoices = invoices.map((invoice) => {
        return {
            id: invoice.id,
            tongTien: invoice.tongTien,
            ngayTao: invoice.ngayTao,
            sanPham: invoice.sanPham1.map((product, index) => {
                return {
                    id: product.id,
                    soLuong: product.soLuong,
                    tenSP: invoice.sanPham2[index].tenSP,
                    giaBan: invoice.sanPham2[index].giaBan,
                }
            })
        }
    })

    res.status(200).json(invoices)
})

invoiceRouter.get('/:id', async function (req, res) {
    const invoice = await Invoice
        .findOne({ id: req.params.id })
        .select(projectFields)

    if (!invoice) {
        res.status(404).json({
            code: 'notFound',
            message: 'Hóa đơn không tồn tại',
        })
    } else {
        res.status(200).json(invoice)
    }
})

invoiceRouter.post('/', async function (req, res) {
    const invoice = req.body
    const cart = invoice.products
    let customer = await Customer.findOne({ ...invoice.customer })
    let finished = false

    if (!customer) {
        res.status(404).json({
            code: 'notFound',
            message: 'Khách hàng không tồn tại',
        })
        return
    }

    let products = await Product.find({
        id: { $in: Object.keys(cart) }
    })
    products.forEach(product => {
        if (cart[product.id].soLuong > product.soLuong) {
            res.status(500).json({
                code: 'internalServerError',
                message: `Số lượng sản phẩm ${product.tenSP} trong kho không đủ`,
            })
            finished = true
        }
    })

    if (finished) return

    let invoices = await Invoice
        .find()
        .select('id')
        .sort('-id')
        .limit(1)
    let nextId
    if (invoices.length === 0) {
        nextId = "HD001"
    } else {
        nextId = getNextId(invoices[0].id)
    }

    const newInvoice = await new Invoice({
        id: nextId,
        tongTien: invoice.tongTien,
        ngayTao: invoice.ngayTao,
        KhachHangid: customer.id,
        tblNhanVienid: invoice.tblNhanVienid,
    }).save()

    const payment = await Payment
        .find()
        .select('id')
        .sort('-id')
        .limit(1)
    if (payment.length === 0) {
        nextId = "TT001"
    } else {
        nextId = getNextId(payment[0].id)
    }
    const newPayment = await new Payment({
        id: nextId,
        ngayThucHien: Date.now(),
        tongTien: invoice.tongTien,
        hinhThucThanhToan: invoice.hinhThucThanhToan,
        nganHang: invoice.nganHang,
        maGiaoDich: invoice.maGiaoDich,
        tblHoaDonid: newInvoice.id,
    }).save()

    await ProductInvoice.insertMany(
        Object.values(cart).map(product => {
            return {
                tenSP: product.tenSP,
                soLuong: product.soLuong,
                donGia: product.giaBan,
                tblHoaDonid: newInvoice.id,
                tblSanPhamid: product.id,
            }
        })
    )

    const updatingProductOp = []
    for (const product of products) {
        updatingProductOp.push(Product.updateOne(
            { id: product.id },
            { soLuong: product.soLuong - cart[product.id].soLuong }
        ))
    }
    await Promise.all(updatingProductOp)

    res.status(201).json({ id: newInvoice.id })
})

invoiceRouter.put('/:id', async function (req, res) {
    const invoice = req.body
    const productIds = invoice.sanPham.map(product => product.id)
    const products = await Product.find({ id: { $in: productIds } })
    const updatingProductInvoiceOp = []
    const updatingProductOp = []
    for (const product of invoice.sanPham) {
        let oldProductInvoice = await ProductInvoice.findOne({
            tblSanPhamid: product.id,
            tblHoaDonid: req.params.id
        })
        if (product.soLuong > products.find(p => p.id === product.id).soLuong + oldProductInvoice.soLuong) {
            res.status(500).json({
                code: 'internalServerError',
                message: `Số lượng sản phẩm ${product.tenSP} trong kho không đủ`,
            })
            return
        }
    }
    for (const product of invoice.sanPham) {
        let oldProductInvoice = await ProductInvoice.findOne({
            tblSanPhamid: product.id,
            tblHoaDonid: req.params.id
        })
        updatingProductInvoiceOp.push(ProductInvoice.updateOne(
            {
                tblHoaDonid: req.params.id,
                tblSanPhamid: product.id,
            },
            { soLuong: product.soLuong },
        ))
        let oldProduct = await Product.findOne({ id: product.id })
        updatingProductOp.push(Product.updateOne(
            { id: product.id },
            { soLuong: oldProduct.soLuong + oldProductInvoice.soLuong - product.soLuong },
        ))
    }
    await Promise.all(updatingProductInvoiceOp)
    await Promise.all(updatingProductOp)

    await Invoice.updateOne({ id: req.params.id }, { tongTien: invoice.tongTien })
    res.status(200).end()
})

export default invoiceRouter
