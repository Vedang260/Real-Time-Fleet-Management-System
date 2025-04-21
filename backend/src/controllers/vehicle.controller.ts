import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { VehicleDto } from '../dtos/vehicle.dto';
import { VehicleService } from '../services/vehicle.service';
import { VehicleStatus } from '../enums/vehicleStatus.enums';

export class VehicleController {
    private vehicleService : VehicleService;

    constructor(fastify: FastifyInstance) {
        this.vehicleService = new VehicleService(fastify); // Injecting the service into the controller
    }

    createVehicle = async ( request: FastifyRequest<{ Body: VehicleDto }>, reply: FastifyReply ) => {
        const result = await this.vehicleService.createVehicle(request.body);
        reply.send(result);
    }

    getAllVehicles = async ( request: FastifyRequest, reply: FastifyReply) => {
        const result = await this.vehicleService.getAllVehicles();
        reply.send(result);
    }

    getVehiclesByDriverId = async (request: FastifyRequest<{ Params: { driverId: string } }>, reply: FastifyReply) => {
        const { driverId } = request.params;
        const result = await this.vehicleService.getVehiclesByDriver(driverId);
        reply.send(result);
    }
    
    updateVehicleStatus = async (request: FastifyRequest<{ Params: { vehicleId: string }, Body: { status: VehicleStatus } }>, reply: FastifyReply) => {
        const { vehicleId } = request.params;
        const { status } = request.body;
        const result = await this.vehicleService.updateVehicleStatus(vehicleId, status);
        reply.send(result);
    }

    deleteVehicle = async ( request: FastifyRequest<{ Params: { vehicleId: string } }>, reply: FastifyReply) => {
        const { vehicleId } = request.params;
        const result = await this.vehicleService.deleteVehicle(vehicleId);
        reply.send(result);
    }

}