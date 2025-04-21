"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeOrmConfig = void 0;
const user_entity_1 = require("../entities/user.entity");
const dotenv_1 = __importDefault(require("dotenv"));
const vehicle_entity_1 = require("../entities/vehicle.entity");
const alert_entity_1 = require("../entities/alert.entity");
const location_entity_1 = require("../entities/location.entity");
dotenv_1.default.config();
exports.typeOrmConfig = {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '12345',
    database: process.env.DB_NAME || 'fleet_management',
    synchronize: true, // ❗ Set to false in production and use migrations instead
    logging: ['error', 'query', 'schema'],
    entities: [user_entity_1.User, vehicle_entity_1.Vehicle, location_entity_1.Location, alert_entity_1.Alert],
    migrations: [],
    subscribers: [],
};
