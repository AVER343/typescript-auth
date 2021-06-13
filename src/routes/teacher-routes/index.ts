import express from 'express'
import Classes from './routes/classes'
import Period from './routes/periods'
import Student from './routes/student'
const TeacherRouter = express.Router()

TeacherRouter.all('*/classes',Classes)
TeacherRouter.all('*/students',Student)
TeacherRouter.all('*/periods',Period)

export default TeacherRouter