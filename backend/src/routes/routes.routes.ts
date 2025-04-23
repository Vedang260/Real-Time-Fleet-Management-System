import { FastifyInstance } from "fastify/types/instance";
import { RoutesController } from "../controllers/routes.controller";
import { Role } from "../enums/role.enums";
import { AssignRoutesDto } from "../dtos/routes.dto";
import { RouteStatus } from "../enums/routeStatus.enums";

export async function routeRoutes(fastify: FastifyInstance){
    const routesController = new RoutesController(fastify);

  fastify.post<{
    Body: AssignRoutesDto;
  }>('/save', {
    preHandler: [fastify.authenticate, fastify.authorizeRoles(Role.ADMIN)] ,
    schema: {
      body: {
        type: 'object',
        required: ['vehicleId', 'startingPlaceName', 'destinationPlaceName', 'startingLocation', 'destinationLocation'],
        properties: {
          vehicleId: { type: 'string' },
          startingPlaceName: { type: 'string' },
          destinationPlaceName: { type: 'string' },
          startingLocation: {
            type: 'object',
            required: ['latitude', 'longitude'],
            properties: {
              latitude: { type: 'number' },
              longitude: { type: 'number' },
            }
          },
          destinationLocation: {
            type: 'object',
            required: ['latitude', 'longitude'],
            properties: {
              latitude: { type: 'number' },
              longitude: { type: 'number' },
            }
          }
        },
      },
    },
  },  routesController.saveRoute.bind(routesController));

    fastify.get<{
        Params: {
        vehicleId: string;
        };
    }>(`/:vehicleId`, 
        { 
            preHandler: [fastify.authenticate, fastify.authorizeRoles(Role.ADMIN, Role.DRIVER, Role.MANAGER)] 
        }, routesController.getRoutes.bind(routesController));

    fastify.put<{
        Params:{
            routesId: string;
        },
        Body:{
            status: RouteStatus
        }
    }>(`/update-status/:routesId`, {
        preHandler: [fastify.authenticate, fastify.authorizeRoles(Role.ADMIN)] ,
        schema: {
            params: {
                type: 'object',
                required: ['routesId'],
                properties: {
                  routesId: { type: 'string' },
                },
            },
            body: {
                type: 'object',
                required: ['status'],
                properties: {
                  status: {
                    type: 'string',
                    enum: Object.values(RouteStatus),
                  },
                },
              },
          },
    }, routesController.updateRouteStatus.bind(routesController));
}