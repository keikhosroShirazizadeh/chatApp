const express =require("express")
require("dotenv").config();
const projectRouter=require("./router/project")
// const articelRouter=require("./router/article")
const uploadRouter=require("./router/upload")
const categoryRouter=require("./router/category")
const messageRouter=require("./router/message")

const app= express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use("/projects",projectRouter)
// app.use("/article",articelRouter)
app.use("/upload",uploadRouter)
app.use("/categories",categoryRouter)
app.use("/contact",messageRouter)

const port=process.env.PORT
const host=process.env.HOST
console.log("test String: ",process.env.test)
console.log("type of host:",typeof(host))
app.listen(port,host.toString(),err=>{
    if(err){
        console.log("server can runnig beacause: ",err);
    }
    console.log(`server is running on ${host}:${port}`)
}
)

