import { Router } from "express";
import {
    renderDetalleOrden,
    renderEditFormOrden,
    updateOrden,
    ordenRecepcion,
    createNewOrdenVehiculo,
    downloadFile,
} from "../controllers/orden.controller";

const router = Router();
const path = require('path');
const multer = require('multer');
const mimeTypes = require('mime-types');
const { v4: uuidv4 } = require('uuid');
//ARCHIVOS

const storageMulter = multer.diskStorage({
    destination: path.join(__dirname, '../public/uploads') ,
    filename: (req, file, cb) =>{
        cb(null, uuidv4() + path.extname(file.originalname)//lo guardo con el id autogerado y concateno la extencion del archivo 
        .toLocaleLowerCase());
    }//como voy a colocar el nombre de las imgs que suba
});

const uploadRepuestos = multer({
    storage: storageMulter,
    // limits: { fileSize: 17825796 },
    dest: path.join(__dirname, '..public/uploads'),
    fileFilter: (req, file, cb) => {//file es el objeto que tinene todos los datos de la imagen como mimetype: image/png 
        // console.log(file);
        const filetypes = /vnd.openxmlformats-officedocument.spreadsheetml.sheet/;
        const mimetype = filetypes.test(file.mimetype);//compruebo que el valor de file.mimetype coincida con los que tiene la var filetypes
        const extname = filetypes.test(path.extname(file.originalname));//con path.extname obtengo la extencion que tiene el valor file.originalname
        
        if (mimetype){
            return cb(null,true);
        }
        cb("Error: El archivo debe ser un Excel.");
    }
}).fields([{ name: 'revision', maxCount: 1 }, { name: 'repuestos', maxCount: 1 } ]);//.array('repuestos');

const uploadRevisionTecnica = multer({
    storage: storageMulter,
    // limits: { fileSize: 17825796 },
    dest: path.join(__dirname, '..public/uploads'),
    fileFilter: (req, file, cb) => {//file es el objeto que tinene todos los datos de la imagen como mimetype: image/png 
        // console.log(file);
        const filetypes = /vnd.openxmlformats-officedocument.spreadsheetml.sheet/;
        const mimetype = filetypes.test(file.mimetype);//compruebo que el valor de file.mimetype coincida con los que tiene la var filetypes
        const extname = filetypes.test(path.extname(file.originalname));//con path.extname obtengo la extencion que tiene el valor file.originalname
        
        if (mimetype){
            return cb(null,true);
        }
        cb("Error: El archivo debe ser un Excel.");
    }
}).array('revisiontecnica');


//new orden
router.get("/ordenRecepcion", ordenRecepcion);

router.post("/vehiculo/new-orden-vehiculo", createNewOrdenVehiculo);


router.get("/orden/detalle-orden/:_id", renderDetalleOrden);

// Edit prden
router.get("/orden/edit/:id", renderEditFormOrden);

router.put("/orden/edit-orden/:id", uploadRepuestos, updateOrden);

//download file
router.get("/orden/download-file/:pathFile", downloadFile);

export default router;
