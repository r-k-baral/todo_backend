import express from 'express'
 
const app = express()


app.get("/",(res,resq)=>{
    resq.send({
        massage:"gopi",
        kiya: "done"
    })
})
app.listen(3500)