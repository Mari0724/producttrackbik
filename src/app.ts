
import fs from "fs";
import path from "path";
import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import "reflect-metadata";
import swaggerUi from "swagger-ui-express";
import { RegisterRoutes } from "./routes/routes";
import nutriscanOCRRoutes from './routes/ocr.routes';
import userRoutes from "./routes/user.routes";
import { uploadProductos } from './middleware/allCloudinaryUploads';
import './utils/cronJobs';
import dotenv from 'dotenv';

const app = express();
dotenv.config()

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

// CORS config
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true
}));

// Middleware Body Parser
app.use(bodyParser.json({ limit: "3mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "3mb" }));

// Rutas manuales primero
app.use('/api/ocr', nutriscanOCRRoutes);
app.use("/api", userRoutes);

// Rutas generadas por tsoa
RegisterRoutes(app);

// Swagger docs (instancia limpia)
const swaggerFilePath = path.join(__dirname, "../docs/swagger.json");
const swaggerRaw = fs.readFileSync(swaggerFilePath, "utf8");
const swaggerData = JSON.parse(JSON.stringify(JSON.parse(swaggerRaw)));

if (process.env.NODE_ENV !== "production") {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerData));
}

// Ruta para subida de imágenes
app.post('/upload', uploadProductos.single('image'), (req: MulterRequest, res: Response) => {
  if (!req.file) {
    res.status(400).json({ error: 'No se subió ningún archivo' });
    return;
  }

  res.json({
    message: 'Imagen subida con éxito',
    url: req.file.path,
    public_id: req.file.filename,
  });
});

app.get('/', (req: Request, res: Response) => {
  res.json({ "ms": "Bienvenido a mi aplicación para probar las rutas en Swagger necesitas estar en entorno local por seguridad, si estas en producción puedes probar las mismas rutas en Postman" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`El server corre bien en http://localhost:${PORT}`);
});

export default app;