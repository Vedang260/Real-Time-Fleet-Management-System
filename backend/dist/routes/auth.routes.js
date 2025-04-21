"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = authRoutes;
const auth_controller_1 = require("../controllers/auth.controller");
const role_enums_1 = require("../enums/role.enums");
async function authRoutes(fastify) {
    const authController = new auth_controller_1.AuthController(fastify);
    fastify.post('/register', {
        schema: {
            body: {
                type: 'object',
                required: ['username', 'email', 'password', 'role'],
                properties: {
                    username: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string', minLength: 6 },
                    role: { type: 'string', enum: Object.values(role_enums_1.Role) },
                },
            },
        },
    }, authController.register.bind(authController));
    fastify.post('/login', {
        schema: {
            body: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string', minLength: 6 },
                },
            },
        },
    }, authController.login.bind(authController));
}
