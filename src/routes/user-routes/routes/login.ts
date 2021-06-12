import express ,{Request,Response} from 'express'
import {body,validationResult} from 'express-validator'
import User from '../../../orm/user'
import HandleResponse from '../../../utils/handleResponse'
const Login = express.Router()
Login.post('/users/login',
        body('username').isEmail().withMessage(('Invalid email !')),
        body('password').isLength({min:5}).withMessage(('Invalid password !')),
        async(req:Request,res:Response)=>{
           try{
                let result = validationResult(req)
                if(!result.isEmpty())
                {
                    return res.send({errors:result.array()})
                }
                let user  = (await User.findOne(req.body))
                if(!user)
                {
                    return HandleResponse(res,'User does not exist !','error')
                }
                let JWT = user.setJWT()
              return res.cookie('JWT',JWT,{maxAge:120*60*1000}).send(user)
           }
           catch(e:any){
            return HandleResponse(res,e.message||'Something went wrong !','error')
        }
    })
    export default Login