import express from 'express'
import { Invoice } from '../models/Invoice.js'
import { ProductInvoice } from '../models/ProductInvoice.js'
import { Customer } from '../models/Customer.js'

const statisticsRouter = express.Router()

statisticsRouter.get('/', async function (req, res) {
    const query = req.query.q
    const startDate = req.query.startDate ? new Date(req.query.startDate) : new Date('1970-01-01')
    const endDate = req.query.endDate ? new Date(req.query.endDate) : new Date()
    endDate.setDate(endDate.getDate() + 1)

    switch (query) {
        case 'top10':
            const products = await Invoice.aggregate([
                {
                    $match: {
                        ngayTao: { $lt: endDate, $gte: startDate }
                    }
                },
                {
                    $lookup: {
                        from: 'tblSanPham-HoaDon',
                        localField: 'id',
                        foreignField: 'tblHoaDonid',
                        as: 'sanPham'
                    }
                },
                { $unwind: '$sanPham' },
                {
                    $project: {
                        _id: 0,
                        maSP: '$sanPham.tblSanPhamid',
                        tenSP: '$sanPham.tenSP',
                        soLuong: '$sanPham.soLuong',
                        ngayTao: 1,
                    }
                },
                {
                    $group: {
                        _id: { maSP: '$maSP', tenSP: '$tenSP' },
                        soLuong: { $sum: '$soLuong' }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        maSP: '$_id.maSP',
                        tenSP: '$_id.tenSP',
                        soLuong: 1,
                    }
                },
                {
                    $sort: {
                        soLuong: -1,
                        maSP: 1,
                    }
                },
                { $limit: 10 }
            ])
            res.status(200).json(products)
            break;
        case 'revenue':
            const revenue = await Invoice.aggregate([
                {
                    $match: {
                        ngayTao: { $lt: endDate, $gte: startDate }
                    }
                },
                {
                    $group: {
                        _id: null,
                        revenue: { $sum: '$tongTien' }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        revenue: 1
                    }
                }
            ])
            res.status(200).json(revenue.length > 0 ? revenue[0] : { revenue: 0 })
            break
        case 'totalSold':
            const totalSold = await ProductInvoice.aggregate([
                {
                    $group: {
                        _id: null,
                        totalSold: { $sum: '$soLuong' }
                    }
                }
            ])
            res.status(200).json(totalSold.length > 0 ? totalSold[0] : { totalSold: 0 })
            break
        case 'totalInvoices':
            const totalInvoices = await Invoice.countDocuments()
            res.status(200).json({ totalInvoices })
            break
        case 'totalCustomers':
            const totalCustomers = await Customer.countDocuments()
            res.status(200).json({ totalCustomers })
            break
        default:
            res.status(400).end()
    }
})

export default statisticsRouter