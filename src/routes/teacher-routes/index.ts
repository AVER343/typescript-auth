import express from 'express'
import Classes from './routes/classes'
const TeacherRouter = express.Router()

TeacherRouter.all('*/classes',Classes)
// TeacherRouter.all('*/',Classes)

export default TeacherRouter