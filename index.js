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
app.delete("/delete/:id",async(req,resq)=>{
    const db = await connection();
    const id = req.params.id
     
    const collection = await db.collection(collectionname)
    const result = await collection.deleteOne({_id:new ObjectId(id)});
    
    if(result){
        resq.send({massage:'Task list deleted', success:true, result})
    }else{
        resq.send({massage:'task  list not deleted', success:false})
    }
    
})

// update 

app.get("/task/:id", async (req, resq) => {
    try {
        const db = await connection();
        const collection = await db.collection(collectionname)
        const id = req.params.id
        const result = await collection.findOne({_id: new ObjectId(id)});
        
        if(result){
            resq.send({massage:'Task fetch', success:true, result})
        } else {
            resq.send({massage:'task not fetch', success:false})
        }
    } catch (error) {
        resq.send({ success: false, error });
    }
})

// --- UPDATE WHOLE TASK (Needed for the Save Changes button) ---
app.put("/tasks/:id", async (req, resq) => {
    try {
        const db = await connection();
        const collection = await db.collection(collectionname);
        const id = req.params.id;
        
        // We remove _id from req.body because MongoDB crashes if you try to update the _id field
        const { _id, ...updatedData } = req.body; 

        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updatedData }
        );

        resq.send({ success: true, massage: "Task fully updated", result });
    } catch (error) {
        resq.send({ success: false, error });
    }
});

// --- TOGGLE CHECKBOX (Needed for the List completion status) ---
app.put("/task/:id", async (req, resq) => {
    try {
        const db = await connection();
        const collection = await db.collection(collectionname);
        const id = req.params.id;

        // Find the task first to see if it is currently true or false
        const task = await collection.findOne({ _id: new ObjectId(id) });

        if (!task) {
            return resq.send({ success: false, massage: "Task not found" });
        }

        // Toggle it to the opposite of what it currently is
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