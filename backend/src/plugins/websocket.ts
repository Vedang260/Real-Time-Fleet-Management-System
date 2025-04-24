import { FastifyPluginAsync } from 'fastify';
import fastifyWebsocket from '@fastify/websocket';
import { WebSocket } from 'ws';
import { LocationService } from '../services/location.service';
import { LocationDto } from '../dtos/location.dto';
import { AlertsService } from '../services/alerts.service';
import { AlertDto } from '../dtos/alert.dto';

const websocketPlugin: FastifyPluginAsync = async (fastify, options) => {
  await fastify.register(fastifyWebsocket);

  const locationService = new LocationService(fastify);
  const alertsService = new AlertsService(fastify);
  
  // Store all connected sockets
const connectedClients: WebSocket[] = [];

  fastify.get('/ws', { websocket: true }, ( socket: WebSocket , req) => {
    try{
        connectedClients.push(socket);
        console.log('Client connected');

        let inactivityTimer: NodeJS.Timeout;

        // Reset inactivity timer ONLY for savePosition messages
        const resetInactivityTimer = async(vehicleId: string, routesId: string) => {
          clearTimeout(inactivityTimer);
          inactivityTimer = setTimeout(async () => {
            const alertDto : AlertDto = {
              vehicleId,
              routesId,
              alertType: 'inactivity',
              message: 'No movement is observed for the vehicle on this route'
            };
            const response = await alertsService.saveAlert(alertDto);

            if(response.success){
              // Send to ALL clients (or only admin if identifiable)
              for (const client of connectedClients) {
                if (client.readyState === WebSocket.OPEN) {
                  client.send(JSON.stringify({
                    type: 'inactivityAlert',
                    message: alertDto.message
                  }));
                }
              }
            }
          }, 10000); // 10 seconds
        };

        // Properly typed message handler
        socket.on('message', async (data: any) => {
          const message = JSON.parse(data.toString());

          if(message.type === 'fetchHistory'){
            // const { vehicleId } = message.payload;
            // const response = await locationService.getLocationHistory(vehicleId);
            // console.log("Response: ", response);
            //   socket.send(JSON.stringify({
            //     type: 'historyResponse',
            //     ...response
            //   }));
          }else if(message.type === 'savePosition'){
            const { vehicleId, routesId, latitude, longitude, stepIndex } = message.payload;
            
            resetInactivityTimer(vehicleId, routesId); // Reset only on savePosition

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
          const index = connectedClients.indexOf(socket);
          if (index !== -1) connectedClients.splice(index, 1);
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