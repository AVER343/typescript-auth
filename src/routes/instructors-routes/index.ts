import express from 'express'
import Classes from './routes/classes'
import Organization from './routes/oganization'
const InstructorRouter = express.Router()

InstructorRouter.all('*/orgs',Organization)
InstructorRouter.all('*/classes',Classes)

export default InstructorRouter