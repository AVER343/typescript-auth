import express from 'express'
import Periods from './routes/periods'
// import Classes from './routes/classes'
const StudentRouter = express.Router()

StudentRouter.all('*/periods',Periods)

export default StudentRouter