import mongoose from 'mongoose'

const customerSchema = mongoose.Schema({
    id: String,
    tenKH: String,
    sdt: String,
    ngaySinh: Date,
    email: String,
})

export const Customer = mongoose.model('Customer', customerSchema, 'tblKhachHang')