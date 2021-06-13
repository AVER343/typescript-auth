import { Router,Request,Response} from 'express'
// import { header } from 'express-validator'
import {validationResult,body} from 'express-validator'
import Server from '../../../server'
import HandleResponse from '../../../utils/handleResponse'
import { hasKey } from '../../../utils/utisl'
const Student= Router()
Student.put('*/students',
            body('student_id').isNumeric().withMessage('Invalid student id !'),
            body('class_id').isNumeric().withMessage('Invalid class id !'),
            body('active_status').isNumeric().withMessage('Invalid active status !'),
        async (req:Request,res:Response)=>{
                try{
                    let result = validationResult(req)
                    if(!result.isEmpty())
                    {
                        return HandleResponse(res,result.array(),'error')
                    }
                    const student_id = hasKey(req.body,'student_id')
                    const class_id = hasKey(req.body,'class_id')
                    const active_status = hasKey(req.body,'active_status')
                    let user    = hasKey(req,'user')
                    let user_id = hasKey(user,'id')
                    let update  =  await Server
                                        .pool
                                        .query(`UDPDATE  class_relationship CR
                                                SET active_status=$3 WHERE user_id=$1 
                                                and CR.PERIOD_ID in (SELECT PR.id FROM PERIOD_RELATIONSHIP  WHERE PR.teacher_id = $4)
                                                returning *`
                                            ,[student_id,class_id,active_status,user_id])
                    if(update.rowCount==0)
                    {
                        return HandleResponse(res,'No user with the provided information exists !','error')
                    }
                    return HandleResponse(res,'The user has been updated !','success')
                }
                catch(e:any){
                    return HandleResponse(res,e.message,'error')
                }
            })
Student.delete('*/students',
            body('student_id').isNumeric().withMessage('Invalid student id !'),
            body('class_id').isNumeric().withMessage('Invalid class id !'),
            body('active_status').isNumeric().withMessage('Invalid active status !'),
        async (req:Request,res:Response)=>{
                try{
                    let result = validationResult(req)
                    if(!result.isEmpty())
                    {
                        return HandleResponse(res,result.array(),'error')
                    }
                    const student_id = hasKey(req.body,'student_id')
                    const class_id = hasKey(req.body,'class_id')
                    const active_status = hasKey(req.body,'active_status')
                    let user    = hasKey(req,'user')
                    let user_id = hasKey(user,'id')
                    let update  =  await Server
                                        .pool
                                        .query(`DELETE FROM  class_relationship CR
                                                WHERE user_id=$1 
                                                and CR.class_id = $2
                                                and CR.PERIOD_ID in (SELECT PR.id FROM PERIOD_RELATIONSHIP  WHERE PR.teacher_id = $4)
                                                returning *`
                                            ,[student_id,class_id,active_status,user_id])
                    if(update.rowCount==0)
                    {
                        return HandleResponse(res,'No user with the provided information exists !','error')
                    }
                    return HandleResponse(res,'The user has been updated !','success')
                }
                catch(e:any){
                    return HandleResponse(res,e.message,'error')
                }
            }) 
export default Student