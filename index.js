import express, { response } from 'express'
import { collectionname, connection } from './dbconfig.js'
 import cors from 'cors'

const app = express()
app.use(express.json());
app.use(cors())
app.post("/add-task",async(req,resq)=>{
    const db = await connection();
     
    const collection = await db.collection(collectionname)
    const result = await collection.insertOne(req.body);
    
    if(result){
        resq.send({massage:'new task added', success:true, result})
    }else{
        resq.send({massage:'task  not added', success:false})
    }
    
})

app.listen(3500)