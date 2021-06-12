import { ROLES } from "./roles";

export interface User_Interface{
    username?:string;
    password?:string;
    email?:string;
    jwt?:string;
    id?:number;
    role_type?:ROLES;
}
