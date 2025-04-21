"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleController = void 0;
const vehicle_service_1 = require("../services/vehicle.service");
class VehicleController {
    constructor(fastify) {
        this.createVehicle = async (request, reply) => {
            const result = await this.vehicleService.createVehicle(request.body);
            reply.send(result);
        };
        this.getAllVehicles = async (request, reply) => {
            const result = await this.vehicleService.getAllVehicles();
            reply.send(result);
        };
        this.getVehiclesByDriverId = async (request, reply) => {
            const { driverId } = request.params;
            const result = await this.vehicleService.getVehiclesByDriver(driverId);
            reply.send(result);
        };
        this.updateVehicleStatus = async (request, reply) => {
            const { vehicleId } = request.params;
            const { status } = request.body;
            const result = await this.vehicleService.updateVehicleStatus(vehicleId, status);
            reply.send(result);
        };
        this.deleteVehicle = async (request, reply) => {
            const { vehicleId } = request.params;
            const result = await this.vehicleService.deleteVehicle(vehicleId);
            reply.send(result);
        };
        this.vehicleService = new vehicle_service_1.VehicleService(fastify); // Injecting the service into the controller
    }
}
exports.VehicleController = VehicleController;
