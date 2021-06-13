import {Response } from 'express'
import { ValidationError } from 'express-validator'
import { ResponseType } from '../interfaces/response'
const HandleResponse=(res:Response,messages:string|ValidationError[],type:ResponseType|null,status_code=400)=>{
   ///handling express validators
   if(typeof messages ==='object')
   {
      let message
      for(message in messages)
      {
         return res.status(400).send({messages:messages.map((e:ValidationError)=>({message:e.msg,type}))})
      }
   }
  
   return res.status(status_code).send({messages:[{message:messages||'Something went wrong !',type}]})
}
export default HandleResponse