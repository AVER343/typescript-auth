import express from 'express'
import Login from './routes/login'
import Logout from './routes/logout'
import Me from './routes/me'
import Signup from './routes/signup'

const UserRouter = express.Router()

UserRouter.all('*/login',Login)
UserRouter.all('*/signup',Signup)
UserRouter.all('*/me',Me)
UserRouter.all('*/logout',Logout)


export default UserRouter
