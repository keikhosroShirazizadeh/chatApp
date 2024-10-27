
const dbOperation=require("../db/dao")
const ErrorCodes = require("../utils/ErrCodes")
const ResponseMessage = require("../utils/ResponseMessage")
const ResponseError=require("../utils/ResponseError")
const HttpStatus = require("../utils/HttpStatus")
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/




const services={}
services.addMessage=async function(message){
   if(!isEmailValid(message.email)){
    return new ResponseMessage("email validation error",ErrorCodes.validationError,HttpStatus.BAD_REQUEST)
   }
   if(message.name.length>20){
    return new ResponseMessage("the length of name should'nt be more than 100 character",ErrorCodes.validationError,HttpStatus.BAD_REQUEST)
   }
   if(message.content.length>150){
    return new ResponseMessage("the length of content should'nt be more than 100 character",ErrorCodes.validationError,HttpStatus.BAD_REQUEST)
   }
   const result= await dbOperation.addDocument("message",message)
   if(result!=null){
    return new ResponseMessage("message sent successfully",ErrorCodes.SUCCESS,HttpStatus.OK)
   }    
   else{
    return new ResponseMessage("message could't be sent",ErrorCodes.REPEATED_DATA,HttpStatus.NOT_ACCEPTABLE)

}
}

services.getAllmessages=async()=>{
    const messages=await dbOperation.findDocuments("message",{},{},{})
    if(messages!=null && messages.length>0){
        return {
            messages:messages,
            errorCode:ErrorCodes.SUCCESS,
            httpCode:HttpStatus.OK
        }
    }else{
        return new ResponseMessage("no message was found",ErrorCodes.NOTFOUND,HttpStatus.NOT_FOUND)
    }

}



function isEmailValid(email) {
    // Check if the email is defined and not too long
    if (!email || email.length > 254) return false;

    // Use a single regex check for the standard email parts
    if (!emailRegex.test(email)) return false;

    // Split once and perform length checks on the parts
    const parts = email.split("@");
    if (parts[0].length > 64) return false;

    // Perform length checks on domain parts
    const domainParts = parts[1].split(".");
    if (domainParts.some(part => part.length > 63)) return false;

    // If all checks pass, the email is valid
    return true;
}

module.exports=services