import { FastifyInstance } from 'fastify';
import { VehicleController } from '../controllers/vehicle.controller';
import { Role } from '../enums/role.enums';

export async function vehicleRoutes(fastify: FastifyInstance) {
  const vehicleController = new VehicleController(fastify);

  fastify.post<{
    Body: {
      model: string;
      licensePlate: string;
      type: string;
      driverId: string;
    };
  }>('/create', {
    preHandler: [fastify.authenticate, fastify.authorizeRoles(Role.ADMIN)] ,
    schema: {
      body: {
        type: 'object',
        required: ['model', 'licensePlate', 'type', 'driverId'],
        properties: {
          model: { type: 'string' },
          licensePlate: { type: 'string' },
          type: { type: 'string'},
          driverId: { type: 'string' }
        },
      },
    },
  },  vehicleController.createVehicle.bind(vehicleController));

  // Get vehicles by driverId
  fastify.get<{
    Params: {
      driverId: string;
    };
  }>(`/driver/:driverId`, { preHandler: [fastify.authenticate, fastify.authorizeRoles(Role.ADMIN, Role.DRIVER, Role.MANAGER)] }, vehicleController.getVehiclesByDriverId.bind(vehicleController));

  // Get all vehicles
  fastify.get('/', { preHandler: [fastify.authenticate, fastify.authorizeRoles(Role.ADMIN, Role.MANAGER)] }, vehicleController.getAllVehicles.bind(vehicleController));

  // delete vehicle
  fastify.delete<{
    Params: {
      vehicleId: string;
    };
  }>(`/:vehicleId`, { preHandler: [fastify.authenticate, fastify.authorizeRoles(Role.ADMIN)]}, vehicleController.deleteVehicle.bind(vehicleController));
}