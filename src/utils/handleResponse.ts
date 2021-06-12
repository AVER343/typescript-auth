import {Response } from 'express'
import { ValidationError } from 'express-validator'
import { ResponseType } from '../interfaces/response'
const HandleResponse=(res:Response,messages:string|ValidationError[],type:ResponseType|null)=>{
   ///handling express validators
   if(typeof messages ==='object')
   {
      let message
      for(message in messages)
      {
         return res.send({messages:messages.map((e:ValidationError)=>({message:e.msg,type}))})
      }
   }
   return res.send({messages:[{message:messages,type}]})
}
export default HandleResponse