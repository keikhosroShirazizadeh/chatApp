class ResponseError extends Error{
    constructor(message,errorCode,httpCode){
        super(message)
        this.errorCode=errorCode
        this.httpCode=httpCode
    }
}
module.exports=ResponseError