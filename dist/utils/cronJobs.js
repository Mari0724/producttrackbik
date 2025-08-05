"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const stockBajo_service_1 = require("../services/notificaciones/stockBajo.service");
// Ejecuta todos los días a las 8:00 AM
node_cron_1.default.schedule('0 8 * * *', async () => {
    await (0, stockBajo_service_1.notificarStockBajo)();
});
