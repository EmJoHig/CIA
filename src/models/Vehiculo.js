import { Schema, model } from "mongoose";

const VehiculoSchema = new Schema(
  {
    marca: {
      type: String,
      required: true,
    },
    modelo: {
      type: String,
      required: true,
    },
    patente: {
      type: String,
      required: true,
    },
    anio: {
      type: String,
      required: true,
    },
    kmActuales: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    // ordenes: {
    //   type: [String],
    //   required: false
    // },
  },
  {
    timestamps: true,
  }
);

export default model("Vehiculo", VehiculoSchema);
