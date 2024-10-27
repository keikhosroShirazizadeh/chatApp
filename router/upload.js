const express=require("express")
const multer=require("multer")
// const filedb=require("../db/file")
const path=require("path")
const dao=require("../db/dao")
const {getSignedUrl}=require("@aws-sdk/s3-request-presigner")
const router=express.Router()
const mime=require("mime-types")
const fs=require("fs")
const AWS =require("aws-sdk");
const multerS3=require("multer-s3");
/**
 * upload as file on a folder
 */
// const diskStorage=multer.diskStorage({
//     destination:function(req,file,cb){
//         cb(null,"./public/uploads")
//     },
//     filename:(req,file,cb)=>{
//         cb(null,file.originalname)
//     }
// })
// const upload=multer({
//     storage:diskStorage
// })

// router.post("/file",upload.single("file"),async(req,res)=>{
//     console.log(req.file)
//     const file={
//         filename:req.file.originalname,
//         fileType:req.file.mimetype,
//         fileUrl:req.file.destination +"/"+ req.file.originalname,
//         fileUploadTime:Date.now()
//     }
//     // const result=await filedb.addFile(file)
//     const result=await dao.addDocument("file",file)
//     console.log(result)
//     if(result.acknowledged==true){
//         res.json({msg:"data inserted successfully",
//             filepath:file.fileUrl
//         })
//     }else{
//         res.json({
//             msg:"there is a problem on crating document"
//         })
//     }


// })

/**
 * upload as file on a object storage
 */
const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { url } = require("inspector")
const dbOperation = require("../db/dao")
require("dotenv").config();

const client = new S3Client({
  region: "default",
	endpoint: process.env.LIARA_ENDPOINT,
	credentials: {
		accessKeyId: process.env.LIARA_ACCESS_KEY,
		secretAccessKey: process.env.LIARA_SECRET_KEY
	},
});

console.log("liara bucket name : ",process.env.LIARA_BUCKET_NAME)

router.post("",async(req,res)=>{
    const filename=req.body.filename
    const filePath=req.body.filepath
    console.log("filename: ",filename)
    console.log("filePath: ",filePath)
    const file=path.join(filePath,filename)
    let fileContent=null
    try{
      
      fileContent=fs.readFileSync(file)
      
    }catch(e){
      console.log("there is no file with this path :",e)
    }
    const params = {
        Body: fileContent,
        Bucket: process.env.LIARA_BUCKET_NAME,
        Key: "images/projects/"+filename,
    };
    
    // async/await
    try {
       const upData= await client.send(new PutObjectCommand(params));
       console.log(upData);
       
      } catch (error) {
          console.log(error);
      }
      
      // callback
    //   client.send(new PutObjectCommand(params), (error, data) => {
    //     if (error) {
    //       console.log(error);
    //     } else {
    //       console.log(data);
    //     //   GetObjectCommand(client,data).then((url)=>console.log(url))
 
    //     }
    //   });
      // const param = {
      //   Bucket: process.env.LIARA_BUCKET_NAME,
      //   Key: filename,
      // };
      
      // const command = new GetObjectCommand(param);
      
      // const url= await getSignedUrl(client, command)
      
     
      console.log("image upload")
      const fileData={
        filename:filename,
        fileUrl:"/images/projects/"+filename,
        fileType:mime.lookup(filename),
        fileUploadTime:Date.now()
      }
      await dbOperation.addDocument("file",fileData)
      res.json(fileData) 
      

      
    
  
})


const config = {
  endpoint: process.env.LIARA_ENDPOINT,
  accessKeyId: process.env.LIARA_ACCESS_KEY,
  secretAccessKey: process.env.LIARA_SECRET_KEY,
  region: "default",
};


const s3 = new AWS.S3(config);

const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.LIARA_BUCKET_NAME,
    key: function (req, file, cb) {
      console.log(file);
      cb(null, file.originalname);
    },
  }),
});


// route
router.post('/upload2', upload.single('objectKey'), async function (req, res) {
  console.log(req.file);

      console.log(req.file)
    const file={
        filename:req.file.originalname,
        fileType:req.file.mimetype,
        fileUrl:req.file.destination +"/"+ req.file.originalname,
        fileUploadTime:Date.now()
    }
    // const result=await filedb.addFile(file)
    const result=await dao.addDocument("file",file)
    console.log(result)
    if(result.acknowledged==true){
        res.json({status: 'success',
          message: 'file uploaded!',
          url: {
            size: req.file.size,
            url: req.file.location,
            name: req.file.key,
            type: req.file.mimetype,
          },
        })
    }else{
        res.json({
            msg:"there is a problem on crating document"
        })

}});



const upload2 = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // limit file size to 5MB
  },
});

router.post('/upload3',upload.single("objectKey"),async(req,res)=>{
    const params = {
      Bucket: 'your_bucket_name',
      Key: req.file.originalname,
      Body: req.file.buffer,
    };
  
    s3.upload(params, (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error uploading file');
      }
  
      res.send('File uploaded successfully');
    });
  
})



module.exports=router       