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
          driverId: { type: 'string' },
          latitude: { type: 'number' },
          longitude: { type: 'number' }
        },
      },
    },
  }, vehicleController.createVehicle.bind(vehicleController));

//   fastify.post('/login', {
//     schema: {
//       body: {
//         type: 'object',
//         required: ['email', 'password'],
//         properties: {
//           email: { type: 'string', format: 'email' },
//           password: { type: 'string', minLength: 6 },
//         },
//       },
//     },
//   }, authController.login.bind(authController));
}