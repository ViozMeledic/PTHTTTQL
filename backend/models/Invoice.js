import mongoose from 'mongoose'

const invoiceSchema = mongoose.Schema({
    id: String,
    tongTien: Number,
    ngayTao: Date,
    KhachHangid: String,
    tblNhanVienid: String,
})

export const Invoice = mongoose.model('Invoice', invoiceSchema, 'tblHoaDon')