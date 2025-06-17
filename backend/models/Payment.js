import {mongoose} from 'mongoose'

const paymentSchema = mongoose.Schema({
    id: String,
    ngayThucHien: Date,
    tongTien: Number,
    hinhThucThanhToan: String,
    nganHang: String,
    maGiaoDich: String,
    tblHoaDonid: String,
})

export const Payment = mongoose.model('Payment', paymentSchema, 'tblThanhToan')