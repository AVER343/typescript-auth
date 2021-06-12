import express ,{NextFunction, Response} from 'express'
import authentication from '../../../middleware/auth'
import HandleResponse from '../../../utils/handleResponse'
const Logout = express.Router()
Logout.post('*/logout',
        authentication,
        async(req:any,res:Response,Next:NextFunction)=>{
           try{
                res.clearCookie('JWT');
                return HandleResponse(res,'You have succesfuly logged out !','success')
           }
           catch(e:any){
            return HandleResponse(res,e.message||'Something went wrong !','error')
           }
    })
    export default Logout