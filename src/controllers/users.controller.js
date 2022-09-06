import User from "../models/User";
import Note from "../models/Note";
import passport from "passport";
import Vehiculo from "../models/Vehiculo";
import Orden from "../models/Orden";

export const renderSignUpForm = (req, res) => res.render("users/signup");

export const singup = async (req, res) => {
  let errors = [];
  const {
    name,
    apellido,
    email,
    domicilio,
    telefono,
    password,
    confirm_password,
    esEmpleado,
  } = req.body;
  if (password != confirm_password) {
    errors.push({ text: "Passwords do not match." });
  }
  if (password.length < 4) {
    errors.push({ text: "Passwords must be at least 4 characters." });
  }
  if (errors.length > 0) {
    res.render("users/signup", {
      errors,
      name,
      email,
      password,
      confirm_password,
    });
  } else {
    // Look for email coincidence
    const emailUser = await User.findOne({ email: email });
    if (emailUser) {
      req.flash("error_msg", "The Email is already in use.");
      res.redirect("/users/signup");
    } else {
      // Saving a New User
      let typeUser = "C";
      if (esEmpleado !== undefined && esEmpleado == "on") typeUser = "E";
      // console.log(typeUser);
      const newUser = new User({
        name,
        apellido,
        email,
        domicilio,
        telefono,
        password,
        typeUser,
      });
      newUser.password = await newUser.encryptPassword(password);
      await newUser.save();
      req.flash("success_msg", "You are registered.");
      res.redirect("/");
    }
  }
};

export const renderSigninForm = (req, res) => res.render("users/signin");

export const signin = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/users/signin",
  failureFlash: true,
});

export const logout = (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out now.");
  res.redirect("/users/signin");
};

export const profile = async (req, res) => {
  const usuario = await User.findById(req.user._id).lean();
  let ordenes = [];

  const vehiculos = await Vehiculo.find({ user: req.user._id })
    .sort({ createdAt: "desc" })
    .lean();
 
  if (vehiculos.length > 0){
    ordenes = await Orden.find({ vehiculo: vehiculos[0]._id })
    .sort({ fechaIngreso: "asc" })
    .lean();
  }

  if (vehiculos.length > 1){
    ordenes = await Orden.find({ user: usuario._id })
    .sort({ fechaIngreso: "asc" })
    .lean();
  }

  res.render("users/profile", { usuario, vehiculos, ordenes });
};

export const renderCliente = async (req, res) => {
  const clientes = await User.find({ typeUser: "C" })
    .sort({ date: "desc" })
    .lean();

  res.render("users/cliente", { clientes });
};

export const renderDetalleCliente = async (req, res) => {
  const cliente = await User.findById(req.params._id).lean();
  let ordenes = [];

  const vehiculos = await Vehiculo.find({ user: cliente._id })
    .sort({ createdAt: "desc" })
    .lean();

  if (vehiculos.length > 0){
    ordenes = await Orden.find({ vehiculo: vehiculos[0]._id })
    .sort({ fechaIngreso: "asc" })
    .lean();
  }

  if (vehiculos.length > 1) {
    ordenes = await Orden.find({ user: cliente._id })
      .sort({ fechaIngreso: "asc" })
      .lean();
  }

  res.render("users/detalle-cliente", { cliente, vehiculos, ordenes });
};
