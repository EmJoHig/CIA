import Vehiculo from "../models/Vehiculo";
import User from "../models/User";
import Orden from "../models/Orden";
import Archivo from "../models/Archivo";

//new orden
export const ordenRecepcion = async (req, res) => {
  const clientes = await User.find({ typeUser: "C" })
    .sort({ date: "desc" })
    .lean();

  // const vehiculos = await Vehiculo.find().sort({ date: "desc" }).lean();

  res.render("users/ordenRecepcion", { clientes });
};

export const createNewOrdenVehiculo = async (req, res) => {
  const {
    clienteSelect,
    vehiculoSelect,
    personalReceptor,
    tarea,
    observacionRecepcion,
  } = req.body;
  console.log(req.body);

  const cliente = await User.findById(clienteSelect).lean();
  const vehiculo = await Vehiculo.findById(vehiculoSelect).lean();

  const newOrden = new Orden({ personalReceptor, tarea, observacionRecepcion });
  newOrden.user = cliente._id;
  newOrden.vehiculo = vehiculo._id;
  await newOrden.save();
  res.redirect("/users/detalle-cliente/" + cliente._id);
};

export const renderDetalleOrden = async (req, res) => {

  const orden = await Orden.findById(req.params._id).lean();

  const cliente = await User.findById(orden.user).lean();

  const vehiculo = await Vehiculo.findById(orden.vehiculo).lean();

  const usuarioLogueado = await User.findById(req.user.id).lean();

  //repuestos orden
  const xlsx = require("xlsx");
  let filePath = '';

  if (orden.archivo){
    for (let archivo of orden.archivo) {
      const archivoRepuestos = await Archivo.findById(archivo).lean();
      if (archivoRepuestos.codigo == 'REP'){
        filePath = archivoRepuestos.pathFile;
      }
    }
  }

  // console.log(filePath);
  let post = {};
  const repuestosOrden = [];

  if (filePath) {
    const workbook = xlsx.readFile(filePath);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    for (let cell in worksheet) {
      const cellAsString = cell.toString();

      if (
        cellAsString[1] !== "r" &&
        cellAsString[1] !== "m" &&
        cellAsString[1] > 1
      ) {
        if (cellAsString[0] === "A") {
          post.codigo = worksheet[cell].v;
        }
        if (cellAsString[0] === "B") {
          post.descripcion = worksheet[cell].v;
        }
        if (cellAsString[0] === "C") {
          post.cantidad = worksheet[cell].v;
          repuestosOrden.push(post);
          post = {};
        }
      }
    }
  }

  //console.log(repuestosOrden);
  //fin repuestos orden

  res.render("orden/detalle-orden", {
    orden,
    cliente,
    vehiculo,
    usuarioLogueado,
    repuestosOrden,
  });
};

export const renderEditFormOrden = async (req, res) => {
  const orden = await Orden.findById(req.params.id).lean();
  // if (note.user != req.user.id) {
  //   req.flash("error_msg", "Not Authorized");
  //   return res.redirect("/notes");
  // }

  //obtengo los archivos que posee la orden

  let idArchivoRepuestos = 0;
  let idArchivoRevision = 0;
  let archivoRepuestosOrden = null;

  if (orden.archivo != undefined){
    for (let arch of orden.archivo) {
      archivoRepuestosOrden = await Archivo.findById(arch).lean();
      if (archivoRepuestosOrden.codigo == 'REP'){
        idArchivoRepuestos = archivoRepuestosOrden.id;
      }
    }
  }

  // console.log(archivoRepuestosOrden);


  const cliente = await User.findById(orden.user).lean();
  const vehiculo = await Vehiculo.findById(orden.vehiculo).lean();
  res.render("orden/edit-orden", { orden, cliente, vehiculo, archivoRepuestosOrden });
};

export const updateOrden = async (req, res) => {
  const { tareasRealizadas, observaciones } = req.body;
  //console.log(req.files.repuestos);

  let fileRevision = req.files.revision;
  let fileRepuestos = req.files.repuestos;

  let pathFileRevision = "";
  let pathFileRepuestos = "";

  let nameFileRevision = "";
  let nameFileRepuestos = "";
  
  let archivo = null;

  console.log(fileRepuestos);


  fileRepuestos.forEach((element) => {
    pathFileRepuestos = element.path;
    nameFileRepuestos = element.originalname;
  });

  // fileRevision.forEach((element) => {
  //   pathFileRevision = element.path;
  // });

  const pathFile = pathFileRepuestos;
  //guardo el archivo
  const newArchivo = new Archivo({ pathFile, codigo: 'REP', nombreArchivo: nameFileRepuestos });
  await newArchivo.save();

  archivo = newArchivo._id;
  

  await Orden.findByIdAndUpdate(req.params.id, {
    tareasRealizadas,
    observaciones,
    archivo,
  });

  // req.flash("success_msg", "ORDEN ACTUALIZADA CORRECTAMENTE");
  res.redirect("/orden/detalle-orden/" + req.params.id);
};


//downlaod file

export const downloadFile = async (req, res) => {
  const archivoRepuesto = await Archivo.findById(req.params.pathFile).lean();
  res.download(archivoRepuesto.pathFile);
};