import { User_Interface } from "../interfaces/user";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import Server from "../server";
const hasKey = (obj:any,key:string)=>{
    return obj && obj[key]
}
class User{
    static pool = Server.pool;
    private user:User_Interface;
    constructor(user:User_Interface){
        this.user = user;
    }
    public getUser(){
        return this.user
    }
    static  async findOne(user:User_Interface){
        let query=`SELECT username,created_time,id,modified_time,role_type FROM USERS `;
        let args:string[]= []
        let argumentsCanBeSearched= ['username','id'] // Add the keys that you want the unique columns for.
        argumentsCanBeSearched.forEach((e)=>{
            if(hasKey(user,e))
            {
                if(args.length==0)
                {
                    query = query + ' WHERE '
                }
                else{
                    query =query + ' or '
                }
                args.push(hasKey(user,e))
                query = query + ` ${e} = $${args.length} ` ;
            }
        })
        query = query + ' LIMIT 1 ;'
       let result =  await User.pool.query(query,args)
        return result.rows[0] 
                ? new User(result.rows[0])
                : null 
    }
    public async setJWT(){
            const JWT = await jwt.sign(this.user,'process.env.JWT_SECRET');
            this.user.jwt = JWT;
            return JWT
    }
    public async save(){
       try{
            const user = await User.findOne(this.user)
            if(!user)
            {
                await this.createUser(this.user);
            }
            else{
                await this.updateUser(this.user)
            }
       }
       catch(e:any){
            throw new Error(e.message)
       }
    }
    public async deleteFields(){
        try{
            let onlyFields = ['username','created_time','id','modified_time','role_type']
            let new_obj:any = {}
            onlyFields.forEach((e)=>{
                new_obj[e]=hasKey(this.user,e)
            })
            this.user = new_obj
        }
        catch(e:any){
             throw new Error(e.message)
        }
     }
    public async createUser(user:User_Interface){
       try{
            let encryptedPassword = await bcrypt.hash(user.password!,8)
            let saved_user = await User.pool.query(`INSERT INTO 
                                                    USERS(username,password,created_time,modified_time,role_type) 
                                                    VALUES($1,$2,now(),now(),$3) returning *`,
                                                    [user.username,encryptedPassword,user.role_type||'student'])
            delete saved_user.rows[0]['password']
            this.user = (new User(saved_user.rows[0])).getUser()
       }
       catch(e:any){
            throw new Error(e)
       }
    }  
    public async updateUser(user:User_Interface){
        // let canUpdateUserInfo =['password'] 
        if(user.password)
        {
            user.password = await bcrypt.hash(user.password!,process.env.HASH_PASSWORD!)
        }
        let updated_user = await User.pool.query(`UPDATE USERS 
                                                SET password = $2
                                                WHERE id = $1 
                                                returning *`,[user.id,user.password])

        this.deleteFields()
        this.user = (new User(updated_user.rows[0])).getUser()
    }
}
export default User