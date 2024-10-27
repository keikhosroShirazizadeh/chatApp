const express =require("express")
// const projectdb=require("../db/project")
const dao=require("../db/dao")
const ObjectId  = require("mongodb").ObjectId
const router=express.Router()

router.post("/",async(req,res)=>{
    const project={
        title:req.body.title,
        description:req.body.description,
        manager:req.body.manager,
        consultant:req.body.consultant,
        images:req.body.imageLinks,
        location:req.body.location,
        categoryId:req.body.categoryId,
        order:req.body.order
    }
    console.log(project.location)
    // const result=await projectdb.createProject(project) 
    const result=await dao.addDocument("project",project)
    console.log(result)
    // const insertion=false
    if(result.acknowledged==true){
        res.json({msg:"data inserted successfully",
            projectTitle:project.title
        })
    }else{
        res.json({
            msg:"there is a problem on crating document"
        })
    }


})
router.get("",async(req,res)=>{
    const allProjects=await dao.findDocuments("project",{},{},{})
    if(allProjects.length>0){
        res.json({
            projects:allProjects
        })
    }else{
        res.json({
            message:"there is no project to show"
        })
    }
})


// router.get("/:title",async(req,res)=>{

//     const query={title:req.params["title"]}
//     const result=await dao.findDocuments("project",query,{},{})
//     if(result.length>0){
//         res.json({
//             results:result
//         })
//     }else{
//         res.json(
//             {
//                 msg:"no data was found",
//                 errcode:404
//             }
//         )
//     }

// })
router.get("/:id",async(req,res)=>{
    const id=req.params["id"]
    const query={_id:ObjectId.createFromHexString(id)}
    const result=await dao.findDocuments("project",query,{},{})
    if(result.length>0){
        res.json({
            results:result
        })
    }else{
        res.json(
            {
                msg:"no data was found",
                errcode:404
            }
        )
    }

})

router.get("/categories/:categoryid",async(req,res)=>{
    const categoryId=req.params["categoryid"]
    const query={categoryId:categoryId}
    const allProjects=await dao.findDocuments("project",query,{},{order:1})
    if(allProjects.length>0){
        res.json({
            projects:allProjects
        })
    }else{
        res.json({
            message:"there is no project to show"
        })
    }
    
})
router.put("/",async(req,res)=>{

    const query={
        title:req.body.title,
    }
    const newChanges=req.body

    const result=await dao.updateWholeDocument("project",query,newChanges)
    if(result.acknowledged==true){
        res.json({msg:"data updated successfully",
            projectTitle:newChanges.title
        })
    }else{
        res.json({
            msg:"there is a problem on updatng document"
        })
    }
})

router.delete("/",async(req,res)=>{
    const query=req.body.title

    const result=await dao.deleteOne("project",{title:query})
    if(result.acknowledged==true){
        res.json({msg:"data deleted successfully"
        })
    }else{
        res.json({
            msg:"there is a problem on deleting document"
        })
    }

})




module.exports=router