"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
class AuthController {
    constructor(fastify) {
        this.register = async (request, reply) => {
            const result = await this.authService.register(request.body);
            reply.send(result);
        };
        this.login = async (request, reply) => {
            const result = await this.authService.login(request.body);
            reply.send(result);
        };
        this.authService = new auth_service_1.AuthService(fastify); // Injecting the service into the controller
    }
}
exports.AuthController = AuthController;
