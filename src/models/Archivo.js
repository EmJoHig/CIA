import { Schema, model } from "mongoose";

const ArchivoSchema = new Schema(
  {
    codigo: { type: String, required: true },
    pathFile: { type: String, required: false },
    nombreArchivo: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default model("Archivo", ArchivoSchema);
