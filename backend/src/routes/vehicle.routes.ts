import { FastifyInstance } from 'fastify';
import { VehicleController } from '../controllers/vehicle.controller';

export async function vehicleRoutes(fastify: FastifyInstance) {
  const vehicleController = new VehicleController(fastify);

  fastify.post('/create', {
    schema: {
      body: {
        type: 'object',
        required: ['model', 'licensePlate', 'type', 'driverId', 'latitude', 'longitude'],
        properties: {
          model: { type: 'string' },
          licensePlate: { type: 'string' },
          type: { type: 'string'},
          driverId: { type: 'string' }
        },
      },
    },
  }, vehicleController.createVehicle.bind(vehicleController));

  // Get vehicles by driverId
  fastify.get('/driver/:driverId', { preHandler: [fastify.authenticate] }, vehicleController.getVehiclesByDriverId.bind(vehicleController));

  // Get all vehicles
  fastify.get('/vehicles', { preHandler: [fastify.authenticate] }, vehicleController.getAllVehicles.bind(vehicleController));

}