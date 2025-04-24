import { FastifyPluginAsync } from 'fastify';
import fastifyWebsocket from '@fastify/websocket';
import { WebSocket } from 'ws';
import { LocationService } from '../services/location.service';
import { LocationDto } from '../dtos/location.dto';

const websocketPlugin: FastifyPluginAsync = async (fastify, options) => {
  await fastify.register(fastifyWebsocket);

  const locationService = new LocationService(fastify);

  fastify.get('/ws', { websocket: true }, ( socket: WebSocket , req) => {
    try{
        console.log('Client connected');

        let inactivityTimer: NodeJS.Timeout;

        // Reset inactivity timer ONLY for savePosition messages
        const resetInactivityTimer = () => {
          clearTimeout(inactivityTimer);
          inactivityTimer = setTimeout(() => {
            socket.send(JSON.stringify({
              type: 'inactivityAlert',
              message: 'No "savePosition" message received for 15 seconds.'
            }));
          }, 15000); // 15 seconds
        };

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
            resetInactivityTimer(); // Reset only on savePosition
            const { vehicleId, routesId, latitude, longitude, stepIndex } = message.payload;
            
            const locationDto : LocationDto = {
              vehicleId,
              routesId,
              latitude,
              longitude
            }
            // save the position into the locationHistory
            const response = await locationService.saveLocation(locationDto);
            if(response.success){
              socket.send(JSON.stringify({
                type: 'positionAck'
              }));
            }

            // checking for the route deviation...
            
          }
        });

        socket.on('close', () => {
          console.log('Client disconnected');
        });

        socket.on('error', (error: Error) => {
          console.error('WebSocket error:', error);
        });
    }catch(error: any){
      console.log('Error in RealTime Web-Sockets: ', error.message);
    }
  });
};

export default websocketPlugin;