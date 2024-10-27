
const mongodb=require("mongodb")  
const env=require("dotenv").config()


   const dbUrl=process.env.DB_URL
   const dbname=process.env.DB_Name
   console.log("dbUrl:",dbUrl);
   console.log("dbname:",dbname)
   

const connectToDb= function (dbUrl){
    return new mongodb.MongoClient(dbUrl)
}
const mongoclient=connectToDb(dbUrl)

const dbOperation={}

dbOperation.addDocument=async(collection,document)=>{
    
    try{
        const result=await mongoclient.db(dbname).collection(collection).insertOne(document);
        return result
    }
    catch(err)
    {
        console.log("error on inserting data on db :",err)
    }
   
}

dbOperation.findDocument=async(collection,query,projection)=>{

    try{
        const result=await mongoclient.db(dbname).collection(collection).findOne(query,projection)
        return result
    }catch(err){
        console.log("err on finding a document in db",err)
    }
}

dbOperation.findDocuments=async(collection,query,projection,orderBy)=>{
    try{
        const result=await mongoclient.db(dbname).collection(collection).find(query,projection).sort(orderBy).toArray()
        return result
    }catch(err){
        console.log("error on finding documents on db",err)
    }
}

dbOperation.updateWholeDocument=async(collection,query,newDocument)=>{
    try{
        const result=await mongoclient.db(dbname).collection(collection).replaceOne(query,newDocument)
        return result
    }catch(err){
        console.log("error on replacing a whole doc for update: ",err)
    }
}

dbOperation.updateDocument=async function(collection,query,setData){
    try{
        const result=await mongoclient.db(dbname).collection(collection).updateOne(query,setData)
        return result
    }catch(err){
        console.log("error on updating documents")
    }
}

dbOperation.deleteOne=async(collection,query)=>{
    try{
        const result=await mongoclient.db(dbname).collection(collection).deleteOne(query)
        return result
    }catch(err){
        console.log("error on deleting a document: ",err)
    }
}

module.exports=dbOperation