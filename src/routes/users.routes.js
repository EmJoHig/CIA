import { Router } from "express";
import {
  renderSignUpForm,
  singup,
  renderSigninForm,
  signin,
  logout,
  profile,
  renderCliente,
  renderDetalleCliente,
} from "../controllers/users.controller";

const router = Router();

// Routes
router.get("/users/signup", renderSignUpForm);

router.post("/users/signup", singup);

router.get("/users/signin", renderSigninForm);

router.post("/users/signin", signin);

router.get("/users/logout", logout);

router.get("/users/profile", profile);

//cliente
router.get("/cliente", renderCliente);

router.get("/users/detalle-cliente/:_id", renderDetalleCliente);

export default router;
