import express, { response } from 'express'
import { collectionname, connection } from './dbconfig.js'
 
const app = express()
app.use(express.json());
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