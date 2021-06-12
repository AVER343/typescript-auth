import { ROLES } from "../interfaces/roles";

let isAuthorized =(allowedArray:ROLES[],user_role:ROLES)=>{
    try{
        // if(user_role=='admin')
        // {
        //     return true
        // }
        if(allowedArray.includes(user_role))
        {
            return true
        }
        return false
    }
    catch(e:any){
        return false
    }
}
export default isAuthorized 