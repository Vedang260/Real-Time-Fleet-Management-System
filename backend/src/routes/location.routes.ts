import { FastifyInstance } from "fastify/types/instance";
import { LocationController } from "../controllers/location.controller";
import { Role } from "../enums/role.enums";

export async function locationRoutes(fastify: FastifyInstance){
    const locationController = new LocationController(fastify);

  fastify.post<{
    Body: {
      latitude: number;
      longitude: number;
      vehicleId: string;
    };
  }>('/save', {
    preHandler: [fastify.authenticate, fastify.authorizeRoles(Role.ADMIN)] ,
    schema: {
      body: {
        type: 'object',
        required: ['latitude', 'longitude', 'vehicleId'],
        properties: {
          latitude: { type: 'number' },
          longitude: { type: 'number' },
          vehicleId: { type: 'string' }
        },
      },
    },
  },  locationController.saveLocation.bind(locationController));

  fastify.get<{
    Params: {
      vehicleId: string;
    };
  }>(`/history/:vehicleId`, { preHandler: [fastify.authenticate, fastify.authorizeRoles(Role.ADMIN, Role.DRIVER, Role.MANAGER)] }, locationController.fetchLocationHistory.bind(locationController));
}