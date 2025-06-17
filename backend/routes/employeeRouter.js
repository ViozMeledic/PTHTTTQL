import express from 'express'
import { Employee } from '../models/Employee.js'
import { getNextId } from '../utils.js'
// import {auth} from '../auth/index.js'

const employeeRouter = express.Router()
const projectFields = '-_id -__v'

employeeRouter.get('/', async function (req, res) {
    const orderBy = req.query.orderBy || 'id'
    const employees = await Employee
        .find()
        .select(projectFields)
        .sort(orderBy)

    res.status(200).json(employees)
})

employeeRouter.get('/:id', async function (req, res) {
    const employee = await Employee
        .findOne({ id: req.params.id })
        .select(projectFields)

    if (!employee) {
        res.status(404).json({
            code: 'notFound',
            message: 'Nhân viên không tồn tại',
        })
    } else {
        res.status(200).json(employee)
    }
})

employeeRouter.post('/', async function (req, res) {
    const employee = req.body
    const employees = await Employee
        .find()
        .select('id')
        .sort('-id')
        .limit(1)
    let nextId
    if (employees.length === 0) {
        nextId = "NV001"
    } else {
        nextId = getNextId(employees[0].id)
    }
    await new Employee({ id: nextId, ...employee }).save();
    res.status(201).json({ id: nextId })
})

employeeRouter.put('/:id', async function (req, res) {
    const newEmployee = req.body
    const result = await Employee
        .updateOne(
            { id: req.params.id },
            {
                tenNV: newEmployee.tenNV,
                diaChi: newEmployee.diaChi,
                sdt: newEmployee.sdt,
                ngaySinh: new Date(newEmployee.ngaySinh),
                chucVu: newEmployee.chucVu,
                luong: newEmployee.luong,
                taiKhoan: newEmployee.taiKhoan,
                matKhau: newEmployee.matKhau,
            })
    if (result.matchedCount === 0) {
        res.status(404).json({
            code: 'notFound',
            message: 'Nhân viên không tồn tại',
        })
    } else if (result.modifiedCount === 1) {
        res.status(200).json({
            code: 'OK',
            message: '',
        })
    }
})

employeeRouter.delete('/:id', async function (req, res) {
    const result = await Employee
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

export default employeeRouter