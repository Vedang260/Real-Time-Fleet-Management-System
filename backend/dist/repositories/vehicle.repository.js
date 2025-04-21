"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleRepository = void 0;
const vehicle_entity_1 = require("../entities/vehicle.entity");
class VehicleRepository {
    constructor(fastify) {
        // Check if the fastify.db is correctly initialized
        if (!fastify.db) {
            throw new Error("Database connection not established.");
        }
        this.repository = fastify.db.getRepository(vehicle_entity_1.Vehicle);
    }
    async createVehicle(vehicleDto) {
        try {
            const newVehicle = this.repository.create(vehicleDto);
            return await this.repository.save(newVehicle);
        }
        catch (error) {
            console.error('Error in creating a new Vehicle: ', error.message);
            throw new error('Error in creating a new Vehicle');
        }
    }
    async getAllVehicles() {
        try {
            return await this.repository.find();
        }
        catch (error) {
            console.error('Error in fetching all the vehicles: ', error.message);
            throw new error('Error in fetching all the vehicles');
        }
    }
    async deleteVehicle(vehicleId) {
        try {
            const result = await this.repository.delete(vehicleId);
            if (result.affected === 0) {
                throw new Error('Vehicle not found');
            }
        }
        catch (error) {
            console.error('Error in deleting a vehicle: ', error.message);
            throw new error('Error in deleting a vehicle');
        }
    }
    async getVehiclesByDriver(driverId) {
        try {
            return await this.repository.find({ where: { driverId } });
        }
        catch (error) {
            console.error('Error in fetching a vehicle by DriverId: ', error.message);
            throw new error('Error in fetching a vehicle by DriverId');
        }
    }
    async updateVehicleStatus(vehicleId, status) {
        try {
            const vehicle = await this.repository.findOne({ where: { vehicleId } });
            if (!vehicle)
                throw new Error("Vehicle not found");
            vehicle.status = status;
            return await this.repository.save(vehicle);
        }
        catch (error) {
            console.error('Error in updating vehicle status: ', error.message);
            throw new error('Error in updating vehicle status');
        }
    }
}
exports.VehicleRepository = VehicleRepository;
