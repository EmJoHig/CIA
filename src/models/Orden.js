import { Schema, model } from "mongoose";

const OrdenSchema = new Schema(
  {
    user: {type: Schema.Types.ObjectId, required: true },
    vehiculo: { type: Schema.Types.ObjectId, required: true },
    mecanico: { type: String, required: false },
    fechaIngreso: { type: Date, default: Date.now },
    fechaFinalizacion: { type: Date, default: Date.now },
    personalReceptor: { type: String, required: false },
    tarea: { type: String, required: false },
    observacionRecepcion: { type: String, required: false },
    tareasRealizadas: { type: String, required: false },
    observaciones: { type: String, required: false },
    archivo: { type: [Schema.Types.ObjectId], required: false},
  },
  {
    timestamps: true,
  }
);

export default model("Orden", OrdenSchema);
