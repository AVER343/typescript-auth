import { Router,Request,Response} from 'express'
import { body } from 'express-validator'
import {validationResult} from 'express-validator'
import Server from '../../../server'
import HandleResponse from '../../../utils/handleResponse'
import { hasKey } from '../../../utils/utisl'
const Periods= Router()
Periods.get('*/periods',
                async(req:any,res)=>{
                    let args =[req.user.id]
             let periods = await  Server.pool.query
                        (`SELECT * FROM class_relationship CR
                        LEFT JOIN PERIOD_RELATIONSHIP PR ON PR.id = CR.USER_ID
                        WHERE CR.user_id =$1 ;`,args)
             return res.send({periods:periods.rows,user_id:req.user.id})
})
Periods.post('*/periods',
            body('period_id').isNumeric().withMessage('Invalid Period !'),
                async(req:Request,res:Response)=>{
                    let result = validationResult(req)
                    if(!result.isEmpty())
                    {
                        return HandleResponse(res,result.array(),'error')
                    }
                let user_id =hasKey(hasKey(req,'user'),'id')
                let period_id = req.body['period_id']
                let periods = await  Server.pool.query
                        (`INSERT INTO class_relationship(CLASS_ID,period_id,user_id) 
                            VALUES((SELECT CLASS_ID from CLASS_PERIOD where period_id = $1 ),$1,$2)
                        ;`,[period_id,user_id])
             return res.send({periods:periods.rows,user_id})
})
export default Periods