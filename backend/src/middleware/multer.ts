import multer from 'multer'
import {v4 as uid} from 'uuid'

const storage = multer.diskStorage({

    destination(req, file, callback) {
        callback(null, "reports")
    },

    filename(req, file, callback) {
      
        const id = uid()
        const extension = file.originalname.split('.').pop()
        const fileName = `${id}.${extension}`
        callback(null, fileName) 
    },

})


export const reportUpload = multer({storage}).single("report") 