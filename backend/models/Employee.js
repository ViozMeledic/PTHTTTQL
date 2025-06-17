import mongoose from 'mongoose'

const employeeSchema = mongoose.Schema({
    id: String,
    tenNV: String,
    diaChi: String,
    sdt: String,
    ngaySinh: Date,
    chucVu: String,
    luong: Number,
    taiKhoan: String,
    matKhau: String,
})

export const Employee = mongoose.model('Employee', employeeSchema, 'tblNhanVien')