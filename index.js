const express = require("express")
const app = express();
const morgan = require("morgan")

const AppError = require("./AppError")

app.use(morgan("common"))

app.use((req,res,next) => {
    res.send("my first middleware")
    //next();
})

const verifyPassword = (req,res,next) =>{
    const { password } = req.query;
    if(password === 'chicken'){
        next()
    }
    res.status(401)
    throw new AppError(401,"Password required")
}

app.use((err,req,res,next) => {
    const { status=500, message= 'something went wrong' } = err;
    res.status(status).send(message)
})

app.get("/error",(req,res) => {
    chicken.fly()
})

app.use((req,res) => {
    res.status(404).send("Not Found")
})

// app.use((err,req,res,next) => {
//     console.log("***********************************")
//     console.log("************ERROR***************")
//     console.log("***********************************")
//     console.log(err)
//     //next()
// })

app.use((req,res,next) => {
    res.send("my second middleware")
    next();
})

app.get("/",(req,res) => {
    res.send("Home")
})

app.get("/dogs",(req,res)=>{
    res.send("Woof")
})

app.use((req,res) => {
    res.status(404).send("NOT FOUND")
})

app.listen(3000, ()=>{
    console.log("Serving on port 3000")
})