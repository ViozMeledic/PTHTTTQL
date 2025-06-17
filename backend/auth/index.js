import { Employee } from '../models/Employee.js'

const projectFields = '-_id -__v'

export async function validateUser(req, res) {
    const employee = await Employee
        .findOne({
            taiKhoan: req.body.username,
            matKhau: req.body.password,
        })
        .select(projectFields)
    if (!employee) {
        res.status(401).json({
            code: 'unauthorized',
            message: '',
        })
        return
    }
    res.status(200).json({ id: employee.id, taiKhoan: employee.taiKhoan, chucVu: employee.chucVu })
}

export function auth(role) {
    return function (req, res, next) {
        if (req.body.role === role) return next()
        res.status(401).json({
            code: 'unauthorized',
            message: 'Người dùng hiện tại không có quyền sử dụng chức năng này'
        })
    }
}
