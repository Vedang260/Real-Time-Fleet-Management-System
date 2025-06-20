import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { RouteStatus } from '../enums/routeStatus.enums';
import { RoutesService } from '../services/routes.service';
import { AssignRoutesDto } from '../dtos/routes.dto';

export class RoutesController {
    private routesService : RoutesService;

    constructor(fastify: FastifyInstance) {
        this.routesService = new RoutesService(fastify); // Injecting the service into the controller
    }

    saveRoute = async ( request: FastifyRequest<{ Body: AssignRoutesDto }>, reply: FastifyReply ) => {
        const result = await this.routesService.saveRoute(request.body);
        reply.send(result);
    }

    getRoutes = async ( request: FastifyRequest<{ Params: {vehicleId: string}}>, reply: FastifyReply) => {
        const { vehicleId } = request.params;
        const result = await this.routesService.getRoutes(vehicleId);
        reply.send(result);
    }
    
    updateRouteStatus = async (request: FastifyRequest<{ Params: { routesId: string }, Body: { status: RouteStatus } }>, reply: FastifyReply) => {
        const { routesId } = request.params;
        const { status } = request.body;
        const result = await this.routesService.updateStatus(routesId, status);
        reply.send(result);
    }

    getRouteByRoutesId = async (request: FastifyRequest<{ Params: {routesId: string }}>, reply: FastifyReply) => {
        const { routesId } = request.params;
        const result = await this.routesService.getRouteByRoutesId(routesId);
        reply.send(result);
    }
}