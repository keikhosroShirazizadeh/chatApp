const categoryService=require("../service/categoryService")
const express=require("express")
const router=express.Router()
router.post("/",async(req,res)=>{

    const category={
        title:req.body.title,
        description:req.body.description
    }
    // const result=await projectdb.createProject(project) 
    const result=await categoryService.addCategory(category)
    console.log(result)
    res.status(result.httpCode).json({
        message:result.message,
        errorCode:result.errorCode
    })

    
})
router.get("/:id",async(req,res)=>{
    const id=req.params["id"]
    try{
        const result=await categoryService.findCatgoryByid(id)
        res.json(result)
    }catch(e){
        res.json({
            message:e.message,
            errorCode:e.errorCode

        }).status(e.httpCode)
    
    }
    
    

})

router.get("",async(req,res)=>{
    try{
        const result=await categoryService.findAll()
        res.json(result)
    }catch(e){
        res.json({
            message:e.message,
            errorCode:e.errorCode

        }).status(e.httpCode)
    
    }
})

router.delete("/:id",async(req,res)=>{
    try{
        const id=req.params["id"]
        const result=await categoryService.deleteById(id)
        res.json(result)
    }catch(e){
        res.json({
            message:e.message,
            errorCode:e.errorCode

        }).status(e.httpCode)
    
    }
})
module.exports=router