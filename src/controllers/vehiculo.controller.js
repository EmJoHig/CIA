import Vehiculo from "../models/Vehiculo";
import User from "../models/User";
import Orden from "../models/Orden";

export const renderViewVehiculo = async (req, res) => {
  res.render("vehiculo/vehiculo");
};


export const ordenRecepcion = async (req, res) => { 

  const clientes = await User.find({ typeUser: 'C' }).sort({ date: "desc" }).lean();

  const vehiculos = await Vehiculo.find().sort({ date: "desc" }).lean();

  res.render("users/ordenRecepcion", { clientes });
};


export const vehiculosUsuario = async (req, res) => { 
  
  const idCliente = req._parsedUrl.query;
  const vehiculos = await Vehiculo.find({ user: idCliente }).sort({ date: "desc" }).lean();


  res.send({ vehiculos });
};




export const renderformVehiculo = async (req, res) => {
  const cliente =  await User.findById(req.params._id).lean();

  res.render("vehiculo/new-vehiculo", { cliente });
};

export const newVehiculo = async (req, res) => {
  
  const cliente =  await User.findById(req.params._id).lean();

  let errors = [];
  const { marca, modelo, patente, anio, kmActuales, color } = req.body;
  if (errors.length > 0) {
    res.render("vehiculo/new-vehiculo", {
      errors,
      marca,
      modelo,
      patente,
      anio,
      kmActuales,
    });
  } else {
    
    const newVehiculo = new Vehiculo({ marca, modelo, patente, anio, kmActuales, color }); 
    newVehiculo.user = cliente._id;
    await newVehiculo.save();
    // req.flash("success_msg", "You are registered.");
    res.redirect("/users/detalle-cliente/"+cliente._id);

  }

};

//detalle vehiculo

export const renderDetalleVehiculo = async (req, res) => {

  const vehiculo = await Vehiculo.findById(req.params._id).lean();

  const ordenes = await Orden.find({ vehiculo: vehiculo._id })
  .sort({ fechaIngreso: "asc" })
  .lean();

  const cliente = await User.findById( vehiculo.user).lean();


  res.render("vehiculo/detalle-vehiculo", { ordenes, cliente, vehiculo });
};






// export const ordenesVehiculo = async (req, res) => {

//   const ordenes = await Orden.find({ vehiculo: req._parsedUrl.query }).sort({ date: "desc" }).lean();
//   // let idUsuario =0;
//   // if (ordenes.length > 0){
    
//   //   idUsuario = ordenes[0]._id;
//   // }

//   console.log(req.params._id);

//   console.log(ordenes);

//   const cliente =  await User.findById(req.params._id).lean();

//   const vehiculos = await Vehiculo.find({ user: cliente._id })
//     .sort({ date: "desc" })
//     .lean();


//   res.json({status: "Success", redirect: 'partials/ordenes-vehiculo', data: ordenes});
//   // res.json({status: "Success", redirect: '/about'});

// };