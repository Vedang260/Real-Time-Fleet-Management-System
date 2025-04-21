"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const helmet_1 = __importDefault(require("@fastify/helmet"));
const db_1 = __importDefault(require("./plugins/db"));
const jwt_1 = __importDefault(require("./plugins/jwt"));
const swagger_1 = __importDefault(require("./plugins/swagger"));
const auth_routes_1 = require("./routes/auth.routes");
const vehicle_routes_1 = require("./routes/vehicle.routes");
require("reflect-metadata");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, fastify_1.default)({ logger: true });
app.register(cors_1.default, { origin: '*' });
app.register(helmet_1.default);
app.register(db_1.default);
app.register(jwt_1.default);
app.register(swagger_1.default);
app.register(auth_routes_1.authRoutes, { prefix: '/api/auth' });
app.register(vehicle_routes_1.vehicleRoutes, { prefix: '/api/vehicles' });
const start = async () => {
    try {
        await app.listen({ port: parseInt(process.env.PORT || '8000') });
        app.log.info(`Server running on http://localhost:${process.env.PORT || 8000}`);
    }
    catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};
start();
