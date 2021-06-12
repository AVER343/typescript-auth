import { Router,Request,Response} from 'express'
import {body,validationResult} from 'express-validator'
import Server from '../../../server'
import HandleResponse from '../../../utils/handleResponse'
import { hasKey } from '../../../utils/utisl'
const Classes= Router()
Classes.get('*/classes',
                async(req:any,res,next)=>{
                    let {class_id}= req.headers
                    let for_specific_class_id= ``
                    let args =[req.user.id]
                    //todo get teacher details and total students
                    if(class_id)
                    {
                        for_specific_class_id = ` and C.id = $2 `
                        args.push(class_id)
                    }
             let classes = await  Server.pool.query
                        (`SELECT C.* FROM INSTRUCTOR_ORGANIZATION IG
                          JOIN CLASSES C ON C.org_id = IG.id 
                        WHERE IG.user_id = $1 and IG.org_active= true ${for_specific_class_id} ;`,args)
             return res.send({classes:classes.rows,user_id:req.user.id})
})
Classes.post('*/classes',
                body('org_id')
                .isNumeric()
                .withMessage('Invalid organization id !'),
                body('class_name')
                .isLength({min:1})
                .withMessage('Invalid organization name !'),
            async (req:Request,res:Response)=>{
            try 
            {
                let result = validationResult(req)
                if(!result.isEmpty())
                {
                    return HandleResponse(res,result.array(),'error')
                }
                let {org_id,class_name}= req.body
                //adding a organization with user_id
                let user    = hasKey(req,'user')
                let user_id = hasKey(user,'id')
                let organization = await  Server.pool.query(`SELECT * FROM INSTRUCTOR_ORGANIZATION 
                                                            WHERE user_id = $1 
                                                                and id=$2
                                                            and org_active= true;`,[user_id,org_id]) 
                if(organization.rowCount==0)
                {
                    throw new Error('Unauthorized to add class to the organization !')
                }
                let class_ = await Server.pool.query
                                        (`INSERT INTO CLASSES(created_on,org_id,class_name)
                                        VALUES(now(),$1,$2) returning *`,[org_id,class_name])
                return res.send({class:class_.rows,org_id,user_id})
            } 
        catch (e:any) {
                return HandleResponse(res,e.message,'error')
            }
})

Classes.patch('*/classes',
                body('class_id')
                .isNumeric()
                .withMessage('Invalid class id !'),
                body('class_active')
                .isBoolean()
                .withMessage('Invalid class status !'),
            async (req:Request,res:Response)=>{
            try 
            {
                let result = validationResult(req)
                if(!result.isEmpty())
                {
                    return HandleResponse(res,result.array(),'error')
                }
                let {class_id,class_active}= req.body
                //adding a organization with user_id
                let user    = hasKey(req,'user')
                let user_id = hasKey(user,'id')
                //todo if status = false ,change  relationship active between class-teacher and class-student
                let classes = await  Server.pool.query(`SELECT * FROM INSTRUCTOR_ORGANIZATION IG
                                                            JOIN CLASSES C ON C.org_id = IG.id
                                                            WHERE IG.user_id = $1 and C.id=$2
                                                            and IG.org_active= true;`,[user_id,class_id]) 
                if(classes.rowCount==0)
                {
                    throw new Error('Unauthorized to make changes to the class !')
                }
                let class_ = await Server.pool.query
                                        (`UPDATE CLASSES
                                          SET  class_active = $1
                                          WHERE id= $2 returning *;`,[class_active,class_id])
                return res.send({class:class_.rows,user_id})
            } 
        catch (e:any) {
                return HandleResponse(res,e.message,'error')
            }
})
Classes.delete('*/classes',
                body('class_id')
                .isNumeric()
                .withMessage('Invalid class id !'),
            async (req:Request,res:Response)=>{
            try 
            {
                let result = validationResult(req)
                if(!result.isEmpty())
                {
                    return HandleResponse(res,result.array(),'error')
                }
                let {class_id}= req.body
                let user    = hasKey(req,'user')
                let user_id = hasKey(user,'id')
                //todo if delete ,delete  relationship active between class-teacher and class-student

                let classes = await  Server.pool.query(`SELECT * FROM INSTRUCTOR_ORGANIZATION IG
                                                            JOIN CLASSES C ON C.org_id = IG.id
                                                            WHERE IG.user_id = $1 and C.id=$2
                                                            and IG.org_active= true;`,[user_id,class_id]) 
                if(classes.rowCount==0)
                {
                    throw new Error('Unauthorized to make changes to the class !')
                }
                let class_ = await Server.pool.query
                                        (`DELETE FROM CLASSES
                                          WHERE id= $1 returning *;`,[class_id])
                return res.send({class:class_.rows,user_id})
            } 
        catch (e:any) {
                return HandleResponse(res,e.message,'error')
            }
})
export default Classes