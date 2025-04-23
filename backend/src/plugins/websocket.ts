import { FastifyPluginAsync } from 'fastify';
import fastifyWebsocket from '@fastify/websocket';
import { WebSocket } from 'ws';
import { LocationService } from '../services/location.service';

const websocketPlugin: FastifyPluginAsync = async (fastify, options) => {
  await fastify.register(fastifyWebsocket);

  const locationService = new LocationService(fastify);

  fastify.get('/ws', { websocket: true }, ( socket: WebSocket , req) => {
    console.log('Client connected');

    // Properly typed message handler
    socket.on('message', async (data: any) => {
      const message = JSON.parse(data.toString());
      if(message.type === 'fetchHistory'){
         const { vehicleId } = message.payload;
         const response = await locationService.getLocationHistory(vehicleId);
         console.log("Response: ", response);
          socket.send(JSON.stringify({
            type: 'historyResponse',
            ...response
          }));
      }else if(message.type === 'savePosition'){
        
      }
      // if(message.type === 'SAVE_LOCATION'){
      //   const { vehicleId, lat, lng } = message.payload;
      // }else if(message.type === 'fetchHistory'){
      //   const { vehicleId } = message.payload;
      //   const response = locationService.getLocationHistory(vehicleId);
      //   socket.send(JSON.stringify({
      //     type: 'historyResponse',
      //     ...response
      //   }));
      // }
    });

    socket.on('close', () => {
      console.log('Client disconnected');
    });

    socket.on('error', (error: Error) => {
      console.error('WebSocket error:', error);
    });
    
    socket.send('Welcome to the WebSocket server!');
  });
};

export default websocketPlugin;