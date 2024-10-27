const ObjectId  = require("mongodb").ObjectId
const dbOperation=require("../db/dao")
const ErrorCodes = require("../utils/ErrCodes")
const HttpStatus = require("../utils/HttpStatus")
const ResponseError=require("../utils/ResponseError")
const ResponseMessage = require("../utils/ResponseMessage")

const service={}
service.addCategory=async function(newCategory){
    let category=await dbOperation.findDocument("category",{"$or":[{"title":newCategory.title},{"_id":newCategory.id}]})
    if(category==null){
       let  result=await dbOperation.addDocument("category",newCategory)
       console.log(result)
       if(result!=null && result.acknowledged==true ){
        return new ResponseMessage("category created successfully",ErrorCodes.SUCCESS,HttpStatus.OK)
       }    
    }else{
        return new ResponseError("a category with this title is created before",ErrorCodes.REPEATED_DATA,HttpStatus.NOT_ACCEPTABLE)

    }

}

service.findCatgoryByid=async function(id){
    const mongoId=ObjectId.createFromHexString(id)
    console.log("mogoid: ",mongoId)
    let category=await dbOperation.findDocument("category",{"_id":mongoId})
    
    if(category){
        return category
    }else{
        throw new ResponseError("catogry with this id is not found",ErrorCodes.NOTFOUND,HttpStatus.NOT_FOUND)

    }
}

service.findAll=async function(){
    const categories=await dbOperation.findDocuments("category",{},{},{})

    if(categories.length>0){
        return categories
    }else{
        throw new ResponseError("there is no categories set yet",ErrorCodes.NODATA,HttpStatus.NOT_FOUND)
    }

}

service.deleteById=async function(id){

    // console.log("requested id:", id)
    const result=await dbOperation.deleteOne("category",{"_id":ObjectId.createFromHexString(id)})
    // console.log("delete result: ",result)
    if(result.deletedCount>0){
        return {
            message:"category deleted successfully",
            deletedId:id,
            errorCode:ErrorCodes.SUCCESS
        }
    }else{
        throw new ResponseError("there was no category with this id to delete",ErrorCodes.NOTFOUND,HttpStatus.NOT_ACCEPTABLE)
    }
    
}
service.updateById=async function(id){
    const result=await dbOperation.updateWholeDocument("category",{})
}


module.exports=service