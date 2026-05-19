import express, { response } from 'express'
import bcrypt from 'bcrypt';
import { collectionname, connection } from './dbconfig.js'
 import cors from 'cors'
import { ObjectId } from "mongodb";
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
const app = express()
app.use(express.json());
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}))
app.use(cookieParser());


// app.post('/signup', async(req,resp)=>{
//     const { name, email, password } = req.body; 

//     console.log({ name, email, password });


//     if(email && password && name)
//         {  const db = await connection();
//         const collectionNAM = await  db.collection('users')    // ya last change
//         // 2. Password ko "Hash" karein (Salt round: 10)
//         const hashedPassword = await bcrypt.hash(password, 10);

//         console.log("Signup Hashed Password Check:", hashedPassword);
//         const result = await collectionNAM.insertOne({
//             name: name,
//             email: email,
//             password: hashedPassword // Plain password ki jagah hash save ho raha hai
//         })


//         if(result){
//              jwt.sign({ _id: result.insertedId },'Google',{expiresIn:'5d'},(error, token)=>{
//         console.log(token);
//         resp.send({
//             success:true,
//             message:'sigUp complete go and login',
//             token
//         })
        
//     })
//         } else {  resp.send({
//              success:false,
//             message:'sigUp not done',
           
//         })}
       
// }
  
    
// })

// // login route 

// app.post('/login', async (req, resp) => {
//     // 1. Get the email and password sent by the React frontend
//     const { email, password } = req.body;

//     // 2. Check if the user filled both fields
//     if (email && password) {
        
//         const db = await connection();
//         const collectionNAM = await db.collection('users');

        


//         // 3. Search the database for a user with this EXACT email and password
//         const user = await collectionNAM.findOne({ email: email});
            
//         // 4. If a matching user is found
//         // if (user) {
            
//         //     // Generate a token for the user (just like in signup)
//         //     jwt.sign({ _id: user._id.toString() }, 'Google', { expiresIn: '5d' }, (error, token) => {
//         //         if (error) {
//         //             return resp.send({ success: false, message: 'Token generation failed' });
//         //         }
                
//         //         // YAY! Login successful. We send success: true
//         //         resp.send({
//         //             success: true,
//         //             message: 'Login successful!',
//         //             token: token,
//         //             name: user.name // Sending the user's name back so i can show "Welcome, [Name]" on the frontend
//         //         });
//         //     });

//         // } else {
//         //     // X Login Failed: Wrong email or password
//         //     resp.send({
//         //         success: false,
//         //         message: 'Invalid email or password'
//         //     });
//         // }
//         if (user) {
//             // 2. Database wale hash ko aur input wale password ko compare karo
//             const isMatch = await bcrypt.compare(password, user.password);

//             if (isMatch) {
//                 // ✅ Password sahi hai
//                 jwt.sign({ _id: user._id.toString() }, 'Google', { expiresIn: '5d' }, (error, token) => {
//                     resp.send({
//                         success: true,
//                         message: 'Login successful!',
//                         token: token,
//                         name: user.name
//                     });
//                 });
//             } else {
//                 resp.send({ success: false, message: 'Invalid credentials' });
//             }
//         } else {
//             // 🚨 FIX: Agar user database mein nahi mila, toh response bhejna zaroori hai!
//             resp.send({ success: false, message: 'Invalid credentials' });
//         }

//     } else {
//         // X Login Failed: Fields are empty
//         resp.send({
//             success: false,
//             message: 'Please provide both email and password'
//         });
//     }
// });



app.post('/signup', async (req, resp) => {
    try {
        const { name, email, password } = req.body; 
        console.log("1. Frontend se aaya data:", { name, email, password });

        if (email && password && name) {
            const db = await connection();
            const collectionNAM = await db.collection('users');
            
            const hashedPassword = await bcrypt.hash(password, 10);
            console.log("2. Generated Hash:", hashedPassword);

            const result = await collectionNAM.insertOne({
                name,
                email,
                password: hashedPassword
            });
            console.log("3. DB Insertion Result:", result.acknowledged);

            if (result) {
                jwt.sign({ _id: result.insertedId }, 'Google', { expiresIn: '5d' }, (error, token) => {
                    resp.send({ success: true, message: 'signUp complete', token });
                });
            }
        } else {
            resp.send({ success: false, message: 'All fields are required' });
        }
    } catch (error) {
        console.log("❌ Signup Main Error:", error.message);
        resp.send({ success: false, message: error.message });
    }
});

app.post('/login', async (req, resp) => {
    try {
        const { email, password } = req.body;
        console.log("1. Login attempting for:", email);

        const db = await connection();
        const collectionNAM = await db.collection('users');

        const user = await collectionNAM.findOne({ email: email });
        console.log("2. User found in DB?:", user ? "YES" : "NO");
            
        if (user) {
            console.log("3. Comparing:", password, "with", user.password);
            const isMatch = await bcrypt.compare(password, user.password);
            console.log("4. Bcrypt match result:", isMatch);

            if (isMatch) {
                jwt.sign({ _id: user._id.toString() }, 'Google', { expiresIn: '5d' }, (error, token) => {
                    resp.send({ success: true, message: 'Login successful!', token, name: user.name });
                });
            } else {
                resp.send({ success: false, message: 'Invalid credentials (Password mismatch)' });
            }
        } else {
            resp.send({ success: false, message: 'Invalid credentials (User not found)' });
        }
    } catch (error) {
        console.log("❌ Login Main Error:", error.message);
        resp.send({ success: false, message: error.message });
    }
});




app.post("/add-task",veryfiJwtTooken,async(req,resq)=>{
    const db = await connection();
     
    const collection = await db.collection(collectionname)
    // 💡 Frontend se aaya data + Backend se nikali hui User ID
    const taskToSave = {
        ...req.body,
        userId: new ObjectId(req.user._id) // String ID ko MongoDB ObjectId mein badalna zaroori hai
    };
    const result = await collection.insertOne(taskToSave);
    
    if(result){
        resq.send({massage:'new task added', success:true, result})
    }else{
        resq.send({massage:'task  not added', success:false})
    }
    
})
app.get("/tasks",veryfiJwtTooken,async(req,resq)=>{
    const db = await connection();
    console.log("cookie",req.cookies['token']);
    
     
    const collection = await db.collection(collectionname)
    const result = await collection.find({ 
        userId: new ObjectId(req.user._id) 
    }).toArray();
    
    if(result){
        resq.send({message:'Task list fetch', success:true, result})
    }else{
        resq.send({message:'task  list not fetch', success:false})
    }
    
})


app.delete("/delete/:id",veryfiJwtTooken,async(req,resq)=>{
    const db = await connection();
    const id = req.params.id
     
    const collection = await db.collection(collectionname)
    const result = await collection.deleteOne({
        _id: new ObjectId(req.params.id),
        userId: new ObjectId(req.user._id) 
    });
    
    if(result.deletedCount > 0){
        resq.send({massage:'Task list deleted', success:true, result})
    }else{
        resq.send({ message: 'Unauthorized or not found', success: false });
    }
    
})

// update 

app.get("/task/:id", veryfiJwtTooken,async (req, resq) => {
    try {
        const db = await connection();
        const collection = await db.collection(collectionname)
        const id = req.params.id
        const result = await collection.findOne({_id: new ObjectId(id) , userId: new ObjectId(req.user._id)});
        
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
app.put("/tasks/:id", veryfiJwtTooken,async (req, resq) => {
    try {
        const db = await connection();
        const collection = await db.collection(collectionname);
        const id = req.params.id;
        
        // We remove _id from req.body because MongoDB crashes if you try to update the _id field
        const { _id,userId: bodyUserId ,...updatedData } = req.body; 

        const result = await collection.updateOne(
            { _id: new ObjectId(id) , userId: new ObjectId(req.user._id) },  //Security: Sirf apna task update ho
            { $set: updatedData }
        );
       // Check matchedCount instead of just result
        if (result.matchedCount > 0) {
            resq.send({ 
                success: true, 
                message: "Task updated successfully", 
                modifiedCount: result.modifiedCount 
            });
        } else {
            resq.send({ 
                success: false, 
                message: "Unauthorized or Task not found" 
            });
        }
       
    } catch (error) {
        resq.send({ success: false, error });
    }
});

// --- TOGGLE CHECKBOX (Needed for the List completion status) ---
app.put("/task/:id",veryfiJwtTooken,async (req, resq) => {
    try {
        const db = await connection();
        const collection = await db.collection(collectionname);
        const id = req.params.id;

        // Find the task first to see if it is currently true or false
        const task = await collection.findOne({ _id: new ObjectId(id),userId: new ObjectId(req.user._id) });

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

function veryfiJwtTooken (req, resp, next){
// console.log("veryfi Jwt Tooken",req.cookies['token'])
const token = req.cookies['token'];
jwt.verify(token, 'Google',(error, decoded)=>{
    if(error){
        return resp.send("invalid tooken")
    } 
   
   // 💡 DECODED mein humne jo ID bheji thi woh mil jayegi
        // Hum ise req.user mein save kar rahe hain taaki '/add-task' 
        // ya '/tasks' ko pata chal sake ki user kaun hai.
        req.user = decoded; 
        
        console.log("User Identified:", req.user._id);
    next()
            
    
   
    
})

}

app.listen(3500)