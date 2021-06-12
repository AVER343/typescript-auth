import express ,{Request,Response} from 'express'
import {body,validationResult} from 'express-validator'
import User from '../../../orm/user'
import HandleResponse from '../../../utils/handleResponse'
const Signup = express.Router()
Signup.post('*/signup',
        body('username').isEmail().withMessage(('Invalid email !')),
        body('password').isLength({min:5}).withMessage(('Invalid password !')),
        body('confirm_password').custom((value, { req }) => {
            if (value !== req.body.password) {
              throw new Error('Password confirmation does not match password');
            }
            return true;
          }),
        async(req:Request,res:Response)=>{
           try{
                let result = validationResult(req)
                if(!result.isEmpty())
                {
                    return HandleResponse(res,result.array(),'error')
                }
                let user  =await User.findOne(req.body)
                if(user)
                {
                return HandleResponse(res,'User already exists !','error')
                }
                //user doesnt exist ,then save (creates new)
                let new_user = new User(req.body)
                await new_user.save()
            return res.send(new_user)
           }
           catch(e:any){
            return HandleResponse(res,e.message||'Something went wrong !','error')
           }
    })
    export default Signup