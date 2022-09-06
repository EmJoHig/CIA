import { Router } from "express";
import {
    renderViewVehiculo,
    renderformVehiculo,
    newVehiculo,
    vehiculosUsuario,
    renderDetalleVehiculo,
    // createNewOrdenVehiculo,
    // ordenRecepcion,
    // ordenesVehiculo
} from "../controllers/vehiculo.controller";
import { isAuthenticated } from "../helpers/auth";

const router = Router();


router.get("/vehiculo", isAuthenticated, renderViewVehiculo);

// router.get("/ordenRecepcion", ordenRecepcion);

//change data select
router.get("/datavehiculo-usuario", vehiculosUsuario);

//change data select vehiculo
// router.get("/dataordenes-vehiculo/:_id", ordenesVehiculo);

//nuevo vehiculo
router.get("/vehiculo/new-vehiculo/:_id", renderformVehiculo);

router.post("/vehiculo/new-vehiculo/:_id", newVehiculo);

// router.post("/vehiculo/new-orden-vehiculo", createNewOrdenVehiculo);

//detalle vehiculo
router.get("/vehiculo/detalle-vehiculo/:_id", renderDetalleVehiculo);

export default router;
