import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { VehicleDto } from '../dtos/vehicle.dto';
import { VehicleService } from '../services/vehicle.service';

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
        const result = await this.vehicleService.getAllVehicles;
        reply.send(result);
    }

    getVehiclesByDriverId = async ( request: FastifyRequest, reply: FastifyReply) => {
        const result = await this.vehicleService.createVehicle(request.body);
        reply.send(result);
    }

    updateVehicleStatus = async ( request: FastifyRequest, reply: FastifyReply) => {
        const result = await this.vehicleService.createVehicle(request.body);
        reply.send(result);
    }

    deleteVehicle = async ( request: FastifyRequest<{ Params: { vehicleId: string } }>, reply: FastifyReply) => {
        const { vehicleId } = request.params;
        const result = await this.vehicleService.deleteVehicle(vehicleId);
        reply.send(result);
    }
}