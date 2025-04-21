"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.default = (0, fastify_plugin_1.default)(async (fastify) => {
    fastify.register(jwt_1.default, {
        secret: process.env.JWT_SECRET || 'your_jwt_secret'
    });
    fastify.decorate('authenticate', async function (request, reply) {
        try {
            await request.jwtVerify();
        }
        catch (err) {
            reply.code(401).send({ message: 'Unauthorized' });
        }
    });
    fastify.decorate('authorizeRoles', function (...allowedRoles) {
        return async function (request, reply) {
            const user = request.user;
            if (!allowedRoles.includes(user?.role)) {
                return reply.code(403).send({ message: 'Forbidden: Insufficient role' });
            }
        };
    });
});
