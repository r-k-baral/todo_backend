import express, { response } from 'express'
import { collectionname, connection } from './dbconfig.js'
 import cors from 'cors'
import { ObjectId } from "mongodb";
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
app.get("/tasks",async(req,resq)=>{
    const db = await connection();
     
    const collection = await db.collection(collectionname)
    const result = await collection.find().toArray();
    
    if(result){
        resq.send({massage:'Task list fetch', success:true, result})
    }else{
        resq.send({massage:'task  list not fetch', success:false})
    }
    
})


app.put("/task/:id", async (req, resq) => {
  const { id } = req.params;

  try {
    const db = await connection();
    const collection = db.collection(collectionname);

    // 🔍 find task
    const task = await collection.findOne({
      _id: new ObjectId(id)
    });

    if (!task) {
      return resq.send({ success: false, message: "Task not found" });
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { completed: !task.completed } }
    );

    resq.send({ success: true, result });

  } catch (error) {
    resq.send({ success: false, error });
  }
});

app.listen(3500)