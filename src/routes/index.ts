import express from 'express'
import UserRouter from './user-routes'
// import UserRouter from './user-routes'

const RouterConfig = express.Router()

RouterConfig.all('/users/*',UserRouter)
export default RouterConfig