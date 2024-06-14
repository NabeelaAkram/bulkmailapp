const express = require("express")
const cors = require("cors")
const nodemailer = require("nodemailer");
const mongoose=require("mongoose")
const app = express()
app.use(cors())
app.use(express.json())

// install nodemailer
mongoose.connect("mongodb+srv://nabeerasheed:123@cluster0.e60sft7.mongodb.net/passkey?retryWrites=true&w=majority&appName=Cluster0").then(function(){
console.log("connected to db")
}).catch(function(){
    console.log("failed to connect")
})
const credential=mongoose.model("credential",{},"bulkmail")



app.post("/sendemail", function (req, res) {
    var msg = req.body.msg
    var emaillist = req.body.emaillist
    console.log(msg)
    console.log(emaillist)
    credential.find().then(function(data){
        console.log(data[0].toJSON())
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
               user: data[0].toJSON().user,
               pass: data[0].toJSON().pass,
                
            },
        });
        new Promise(async function(resolve,reject){
            try{
                console.log(emaillist)
                for(i = 0; i < emaillist.length; i++)
                {
             await  transporter.sendMail({
                   from: "nabeerasheed@gmail.com",
                   to: emaillist[i],
                   subject: "A message from gmail app",
                   text: msg
               })
            console.log("email sent to"+emaillist[i])
            }
            resolve("success")
            }
             catch(error){
            reject("failed")
             }   
            
        })
    .then(function(){
        res.send(true)
    })
    .catch(function(){
        res.send(false)
    })
    }).catch(function(error){
        console.log(error)
    })
    
})

app.listen(5000, function () {
    console.log("server sarted...")
})