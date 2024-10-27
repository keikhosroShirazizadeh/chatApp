const {ObjectId} =require("mongodb")
class Context {
    constructor(){
        this.id=ObjectId.createFromTime(Date.now())
    }
}