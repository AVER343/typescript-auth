// import { defaultCipherList } from 'constants'
import { Router,Request,Response} from 'express'
// import { header } from 'express-validator'
import {validationResult,body} from 'express-validator'
import Server from '../../../server'
import HandleResponse from '../../../utils/handleResponse'
import { hasKey } from '../../../utils/utisl'

let Period = Router()
Period.get('*/periods',
            // header('period_id').isNumeric().withMessage('Invalid period ID !'),
            async(req:Request,res:Response)=>{
                try{
                    let result = validationResult(req)
                    if(!result.isEmpty())
                    {
                        return HandleResponse(res,result.array(),'error')
                    }
                    let period_id = hasKey(req.headers,'period_id')
                    let user    = hasKey(req,'user')
                    let user_id = hasKey(user,'id')
                    let query = ''
                    let args=[user_id]
                    if(period_id){
                        query=' and PR.id =$2'
                        args.push(period_id)
                    }
                    let periods = await Server.pool.query(`SELECT *
                    FROM CLASS_PERIOD CR 
                    JOIN PERIOD_RELATIONSHIP PR on PR.id = CR.PERIOD_ID
                    WHERE TEACHER_ID = $1 ${query} and active_status=true`,args)
                    return res.send({periods:periods.rows})
                }
                catch(e:any){
                    return HandleResponse(res,e.message,'error')
                }
    })
    
Period.post('*/periods',
        body('class_id').isNumeric().withMessage('Invalid class id !'),
        async(req:Request,res:Response)=>{
        try{
            let result = validationResult(req)
            if(!result.isEmpty())
            {
                return HandleResponse(res,result.array(),'error')
            }
            let class_id = hasKey(req.body,'class_id')
            let user    = hasKey(req,'user')
            let user_id = hasKey(user,'id')
            await Server.pool.query('BEGIN')
            let periods = await Server
                                .pool
                                .query(`INSERT INTO PERIOD_RELATIONSHIP(TEACHER_ID)
                                        VALUES($1)
                                        returning *
                            `,[user_id])
            let CLASS_PERIOD= await Server
                                .pool
                                .query(`INSERT INTO CLASS_PERIOD(CLASS_ID,PERIOD_ID)
                                        VALUES($1,$2)
                                        returning *`,
                                        [ class_id , periods.rows[0]['id'] ]) 
            await Server.pool.query('COMMIT')
            return res.send({class:CLASS_PERIOD.rows[0],periods:periods.rows[0]})
        }
        catch(e:any){
            await Server.pool.query(('ROLLBABCK'))
            return HandleResponse(res,e.message,'error')
        }
})
Period.delete('*/periods',
        body('period_id').isNumeric().withMessage('Invalid period id !'),
        async(req:Request,res:Response)=>{
        try{
            let result = validationResult(req)
            if(!result.isEmpty())
            {
                return HandleResponse(res,result.array(),'error')
            }
            let period_id = hasKey(req.body,'period_id')
            let user    = hasKey(req,'user')
            let user_id = hasKey(user,'id')
            let updated_period = await Server.pool.query(`UPDATE PERIOD_RELATIONSHIP   
                                                          SET TEACHER_ID = null 
                                                         WHERE TEACHER_ID = $1 and id =$2
                                                         returning *;`
                                                         ,[user_id,period_id])
            return res.send(updated_period.rows)
        }
        catch(e:any){
            await Server.pool.query(('ROLLBABCK'))
            return HandleResponse(res,e.message,'error')
        }
})

export default Period;
