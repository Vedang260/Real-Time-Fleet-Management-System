"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const ormconfig_1 = require("../config/ormconfig");
const typeorm_1 = require("typeorm");
exports.default = (0, fastify_plugin_1.default)(async (fastify) => {
    try {
        fastify.log.info('Attempting to connect to database with config:', ormconfig_1.typeOrmConfig);
        const connection = new typeorm_1.DataSource(ormconfig_1.typeOrmConfig);
        await connection.initialize();
        fastify.log.info('Database connected successfully');
        fastify.decorate('db', connection);
    }
    catch (err) {
        fastify.log.error('Database connection error:', err.message);
        throw new Error('Failed to connect to database');
    }
});
