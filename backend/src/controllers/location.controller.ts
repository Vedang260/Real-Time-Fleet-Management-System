import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { LocationService } from "../services/location.service";
import { LocationDto } from "../dtos/location.dto";

export class LocationController{
    private locationService: LocationService;

    constructor(fastify: FastifyInstance) {
        this.locationService = new LocationService(fastify); // Injecting the service into the controller
    }

    saveLocation = async ( request: FastifyRequest<{ Body: LocationDto }>, reply: FastifyReply ) => {
        const result = await this.locationService.saveLocation(request.body);
        reply.send(result);
    }

    fetchLocationHistory = async ( request: FastifyRequest<{ Body: {vehicleId: string}}>, reply: FastifyReply) => {
        const result = await this.locationService.getLocationHistory(request.body.vehicleId);
        reply.send(result);
    }
}