import mongoose from 'mongoose'

const productSchema = mongoose.Schema({
    id: String,
    tenSP: String,
    giaBan: Number,
    soLuong: Number,
})

export const Product = mongoose.model('Product', productSchema, 'tblSanPham')