import express from 'express'
import authentication from '../middleware/auth'
import isAuthorized from '../middleware/isAuthorized'
import HandleResponse from '../utils/handleResponse'
import InstructorRouter from './instructors-routes'
import StudentRouter from './student-routes'
import TeacherRouter from './teacher-routes'
import UserRouter from './user-routes'
// import UserRouter from './user-routes'

const RouterConfig = express.Router()

RouterConfig.all('/users/*',UserRouter)
RouterConfig.all('/instructor/*',
                    authentication,    
                //authorization ,role based 
                    (req:any,res,next)=>{
                        if(!isAuthorized(['instructors'],req.user.role_type))
                        {
                            return HandleResponse(res,'Unauthorized. Please contact administrator ,if you think it is a mistake .','error')
                        }
                       return next()
                    },  
                    InstructorRouter)
RouterConfig.all('/teacher/*',
                    authentication,    
                    //authorization ,role based 
                    (req:any,res,next)=>{
                        if(!isAuthorized(['teacher'],req.user.role_type))
                        {
                            return HandleResponse(res,'Unauthorized. Please contact administrator ,if you think it is a mistake .','error')
                        }
                       return next()
                    },  
                    TeacherRouter)
RouterConfig.all('/student/*',
                    authentication,    
                    //authorization ,role based 
                    (req:any,res,next)=>{
                        if(!isAuthorized(['student'],req.user.role_type))
                        {
                            return HandleResponse(res,'Unauthorized. Please contact administrator ,if you think it is a mistake .','error')
                        }
                       return next()
                    },  
                    StudentRouter)
RouterConfig.all('*',(req:any,res,next)=>{
    return HandleResponse(res,'Route not found !','error',404)
})
export default RouterConfig