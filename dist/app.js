"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
require("reflect-metadata");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const routes_1 = require("./routes/routes");
const ocr_routes_1 = __importDefault(require("./routes/ocr.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const allCloudinaryUploads_1 = require("./middleware/allCloudinaryUploads");
require("./utils/cronJobs");
const dotenv_1 = __importDefault(require("dotenv"));
const app = (0, express_1.default)();
dotenv_1.default.config();
// CORS config
app.use((0, cors_1.default)({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true
}));
// Middleware Body Parser
app.use(body_parser_1.default.json({ limit: "3mb" }));
app.use(body_parser_1.default.urlencoded({ extended: true, limit: "3mb" }));
// Rutas manuales primero
app.use('/api/ocr', ocr_routes_1.default);
app.use("/api", user_routes_1.default);
// Rutas generadas por tsoa
(0, routes_1.RegisterRoutes)(app);
// Swagger docs (instancia limpia)
const swaggerFilePath = path_1.default.join(__dirname, "../docs/swagger.json");
const swaggerRaw = fs_1.default.readFileSync(swaggerFilePath, "utf8");
const swaggerData = JSON.parse(JSON.stringify(JSON.parse(swaggerRaw)));
if (process.env.NODE_ENV !== "production") {
    app.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerData));
}
// Ruta para subida de imágenes
app.post('/upload', allCloudinaryUploads_1.uploadProductos.single('image'), (req, res) => {
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
app.get('/', (req, res) => {
    res.json({ "ms": "Bienvenido a mi aplicación para probar las rutas en Swagger necesitas estar en entorno local por seguridad, si estas en producción puedes probar las mismas rutas en Postman" });
});
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`El server corre bien en http://localhost:${PORT}`);
});
exports.default = app;
