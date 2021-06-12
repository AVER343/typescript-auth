export const hasKey = (obj:any,key:string)=>{
    return obj && obj[key]
}
import {Request} from 'express';
import { User_Interface } from '../interfaces/user';

export interface RequestCustom extends Request
{
    user: User_Interface;
}