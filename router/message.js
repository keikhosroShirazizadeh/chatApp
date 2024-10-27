const messageService=require("../service/messageService")

const express=require("express")

const router=express.Router()

router.post("",async(req,res)=>{
    const message={
        email:req.body.email,
        name:req.body.name,
        content:req.body.content
    }
    const result=await messageService.addMessage(message)
    res.status(result.httpCode).json(result)
})

module.exports=router