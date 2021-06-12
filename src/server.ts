import express, { Router } from 'express'
import { Pool } from 'pg';
import cookieParser from 'cookie-parser'
import cors from 'cors'
import pool from './db/database-connection';
class Server{
    private app;
    static PORT:number;
    static pool:Pool= pool;
    constructor(PORT:number){
            Server.pool = pool
            this.app = express()
            this.configureServer()
            Server.PORT = PORT
    }
    public useRoutes(router:Router){
        this.app.use(router)
    }
    start(){
        this.app.listen(Server.PORT,()=>{
            console.log(`Server running at ${Server.PORT}`)
        })
    }
    private configureServer(){
        this.app.use(express.json())
        this.app.use(express.urlencoded({extended:true}))
        this.app.use(cookieParser())
        this.app.use(cors({credentials:true,origin:true}))
        this.app.use(function(req, res, next) {
            res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
            res.header('Access-Control-Allow-Credentials', `true`);
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                next();
            })
    }
}
export default Server