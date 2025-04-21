"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vehicleRoutes = vehicleRoutes;
const vehicle_controller_1 = require("../controllers/vehicle.controller");
const role_enums_1 = require("../enums/role.enums");
async function vehicleRoutes(fastify) {
    const vehicleController = new vehicle_controller_1.VehicleController(fastify);
    fastify.post('/create', {
        preHandler: [fastify.authenticate, fastify.authorizeRoles(role_enums_1.Role.ADMIN)],
        schema: {
            body: {
                type: 'object',
                required: ['model', 'licensePlate', 'type', 'driverId'],
                properties: {
                    model: { type: 'string' },
                    licensePlate: { type: 'string' },
                    type: { type: 'string' },
                    driverId: { type: 'string' }
                },
            },
        },
    }, vehicleController.createVehicle.bind(vehicleController));
    // Get vehicles by driverId
    fastify.get(`/driver/:driverId`, { preHandler: [fastify.authenticate, fastify.authorizeRoles(role_enums_1.Role.ADMIN, role_enums_1.Role.DRIVER, role_enums_1.Role.MANAGER)] }, vehicleController.getVehiclesByDriverId.bind(vehicleController));
    // Get all vehicles
    fastify.get('/', { preHandler: [fastify.authenticate, fastify.authorizeRoles(role_enums_1.Role.ADMIN, role_enums_1.Role.MANAGER)] }, vehicleController.getAllVehicles.bind(vehicleController));
    // delete vehicle
    fastify.delete(`/:vehicleId`, { preHandler: [fastify.authenticate, fastify.authorizeRoles(role_enums_1.Role.ADMIN)] }, vehicleController.deleteVehicle.bind(vehicleController));
}
