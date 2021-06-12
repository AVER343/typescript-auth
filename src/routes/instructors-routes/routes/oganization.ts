import { Request,Router,Response} from 'express'
import {body,validationResult} from 'express-validator'
import Server from '../../../server'
import HandleResponse from '../../../utils/handleResponse'
import { hasKey } from '../../../utils/utisl'
const Organization= Router()
Organization.get('*/orgs',
                async(req:any,res,next)=>{
             let organization = await  Server.pool.query
                        (`SELECT * FROM INSTRUCTOR_ORGANIZATION WHERE user_id = $1 and org_active= true;`,[req.user.id])
             return res.send({organization:organization.rows,user_id:req.user.id})
})
Organization.post('*/orgs',
                body('org_name')
                        .isLength({min:1})
                        .withMessage('Invalid organization name !'),
                async (req:Request,res:Response)=>{
                    try {
                        let result = validationResult(req)
                        if(!result.isEmpty())
                        {
                            return HandleResponse(res,result.array(),'error')
                        }
                        let {org_name}= req.body
                        //adding a organization with user_id
                        let user    = hasKey(req,'user')
                        let user_id = hasKey(user,'id')
                        let org =await  Server.pool.query
                            (`INSERT INTO INSTRUCTOR_ORGANIZATION(user_id,org_name,generated_on)
                              VALUES($1,$2,now()) returning *`,[user_id,org_name])
                        res.send({org:org.rows,user})
                      } 
                    catch (e:any) {
                       return HandleResponse(res,e.message,'error')
                      }
            return res.send({})
})
Organization.patch('*/orgs', 
                    body('org_id')
                    .isNumeric()
                    .withMessage('Invalid organization id (org_id) !'),
                    body('org_active')
                        .isBoolean()
                        .withMessage('Invalid actve status !'),
                    async (req:Request,res:Response)=>{
                        //todo -> cascade and disable the classes related to org ,use transaction 
                        let result = validationResult(req)
                        if(!result.isEmpty())
                        {
                            return HandleResponse(res,result.array(),'error')
                        }
                        let user    = hasKey(req,'user')
                        let user_id = hasKey(user,'id')

                     let updated_ogs =   await Server.pool.query
                            (`UPDATE INSTRUCTOR_ORGANIZATION
                               SET org_active = $3
                              WHERE user_id=$1 and id=$2 returning *`,
                              [user_id , req.body.org_id, req.body.org_active])
                    return res.send(({updated_orgs:updated_ogs.rows}))
})

export default Organization