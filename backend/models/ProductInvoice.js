import {mongoose} from 'mongoose'

const productInvoiceSchema = mongoose.Schema({
    tenSP: String,
    soLuong: Number,
    donGia: Number,
    tblHoaDonid: String,
    tblSanPhamid: String,
})

export const ProductInvoice = mongoose.model('ProductInvoice', productInvoiceSchema, 'tblSanPham-HoaDon')