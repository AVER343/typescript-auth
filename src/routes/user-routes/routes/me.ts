import express ,{NextFunction, Response} from 'express'
import authentication from '../../../middleware/auth'
import HandleResponse from '../../../utils/handleResponse'
const Me = express.Router()
Me.post('*/me',
        authentication,
        async(req:any,res:Response,Next:NextFunction)=>{
           try{
                    
                return res.send(req.user)
           }
           catch(e:any){
            return HandleResponse(res,e.message||'Something went wrong !','error')
           }
    })
    export default Me