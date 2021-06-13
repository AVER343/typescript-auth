import { Router,Request,Response} from 'express'
// import { header } from 'express-validator'
// import {validationResult} from 'express-validator'
import Server from '../../../server'
// import HandleResponse from '../../../utils/handleResponse'
import { hasKey } from '../../../utils/utisl'
const Classes= Router()
Classes.get('*/classes',
        async(req:Request,res:Response)=>{
            let class_id = hasKey(req.headers,'class_id')
            //adding a organization with user_id
            let user    = hasKey(req,'user')
            let user_id = hasKey(user,'id')
            let for_specific_class_id=' and C.class_id = $2'
            let args =[user_id]
            let class_
            if(!class_id)
            {
                class_= await Server.pool.query(`SELECT  C.class_id,COUNT(*) FROM class_relationship C
                                                 JOIN users u on C.user_id = u.id
                                                 WHERE user_id=$1
                                                 and active_status = true 
                                                 and role_type='student'
                                                 group by C.class_id ;`,args)
            }
            else{
                 args.push(class_id)
                 class_= await Server.pool.query(`SELECT C.*,u.username FROM class_relationship C
                                                 JOIN users u on C.user_id = u.id
                                                 WHERE user_id=$1 ${for_specific_class_id} 
                                                 and active_status = true and role_type='student' ;`
                                                 ,args)
            }
            res.send({class_data:class_.rows})
})
export default Classes