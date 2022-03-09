const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req,res, cb){
        cb(null, '/uploads')
    },
    filename: function(req,file, cb){
        let ext = path.extname(file.originalname)
        cb(null, Date.now() + ext)
    }
})

const upload = multer({
    storage: storage,
    fileFilter: function(req, file, callback){
        if(
            file.mimetype === "image/png" || file.mimetype === "image/jpg"
        ){
            callback(null, true)
        }else{
            console.log("Only png And Jpg file supported!")
            callback(null, false)
        }
    },
    limits:{
        fileSize: 1024 * 1024 * 2
    }
})

module.exports = upload;