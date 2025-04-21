"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleService = void 0;
const vehicle_repository_1 = require("../repositories/vehicle.repository");
class VehicleService {
    constructor(fastify) {
        this.fastify = fastify;
        this.vehicleRepository = new vehicle_repository_1.VehicleRepository(fastify);
    }
    async createVehicle(vehicleDto) {
        try {
            const newVehicle = await this.vehicleRepository.createVehicle(vehicleDto);
            if (newVehicle) {
                return {
                    success: true,
                    message: 'New Vehicle is created successfully'
                };
            }
            return {
                success: false,
                message: 'Failed to create a new vehicle'
            };
        }
        catch (error) {
            console.error('Error in creating a new Vehicle: ', error.message);
            return {
                success: false,
                message: 'Failed to create a new Vehicle'
            };
        }
    }
    async getAllVehicles() {
        try {
            const vehicles = await this.vehicleRepository.getAllVehicles();
            return {
                success: true,
                message: 'All vehicles are fetched successfully',
                vehicles: vehicles
            };
        }
        catch (error) {
            console.error('Error in fetching all the vehicles: ', error.message);
            return {
                success: false,
                message: 'Failed to fetch all the vehicles'
            };
        }
    }
    async getVehiclesByDriver(driverId) {
        try {
            const vehicles = await this.vehicleRepository.getVehiclesByDriver(driverId);
            return {
                success: true,
                message: 'All vehicles are fetched successfully',
                vehicles: vehicles
            };
        }
        catch (error) {
            console.error('Error in fetching a Vehicle by DriverId: ', error.message);
            return {
                success: false,
                message: 'Failed to fetch a Vehicle by DriverId'
            };
        }
    }
    async deleteVehicle(vehicleId) {
        try {
            await this.vehicleRepository.deleteVehicle(vehicleId);
            return {
                success: true,
                message: 'Vehicle deleted successfully'
            };
        }
        catch (error) {
            console.error('Error in deleting a vehicle: ', error.message);
            return {
                success: false,
                message: 'Failed to deleting a vehicle'
            };
        }
    }
    async updateVehicleStatus(vehicleId, status) {
        try {
            const updated = await this.vehicleRepository.updateVehicleStatus(vehicleId, status);
            return {
                success: true,
                message: 'Vehicle status updated successfully',
                vehicle: updated
            };
        }
        catch (error) {
            console.error('Error in updating vehicle status: ', error.message);
            return {
                success: false,
                message: 'Failed to update vehicle status'
            };
        }
    }
}
exports.VehicleService = VehicleService;
