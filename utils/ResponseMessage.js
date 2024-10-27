class ResponseMessage{
    constructor(message,errorCode,httpCode){
        this.message=message
        this.errorCode=errorCode
        this.httpCode=httpCode
    }
}
module.exports=ResponseMessage