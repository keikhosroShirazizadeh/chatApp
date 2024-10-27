const { ObjectId } = require("mongodb")
const dbOperation=require("../db/dao")
const ResponseError = require("../utils/ResponseError")
const ErrorCodes = require("../utils/ErrCodes")
const HttpStatus = require("../utils/HttpStatus")
const service={}
service.findById=async function(id){
    let project=dbOperation.findDocument("project",{_id:new ObjectId.cacheHexString(id)},{})
    if(project!=null){
        return project
    }
    else{
        throw new ResponseError("there is a project with this id exist",ErrorCodes.REPEATED_DATA,HttpStatus.FOUND)
    }
}
service.findByProjectByTitle=async function(title){
    let project=dbOperation.findDocument("project",{title:title},{})
    if(project!=null){
        return project
    }
    else{
        throw new ResponseError("there is a project with this title",ErrorCodes.REPEATED_DATA,HttpStatus.FOUND)
    }
}
service.addProject=async function(project){

    try{

        let project=await service.findById(project._id)
        project=await service.findByProjectByTitle(project.title)
        let result=await dbOperation.addDocument("project",project)

        return 

        

    }catch(e){

        if(e.errorCode==ErrorCodes.REPEATED_DATA)

    }


}

module.exports=service