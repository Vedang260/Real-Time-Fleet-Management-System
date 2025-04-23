import { FastifyInstance } from "fastify";
import { RoutesRepository } from "../repositories/routes.repository";
import { AssignRoutesDto, RoutesDto } from "../dtos/routes.dto";
import { generateRoute } from "../utils/generateRoutes.utils";
import { RouteStatus } from "../enums/routeStatus.enums";

export class RoutesService{
    private routesRepository: RoutesRepository;

    constructor(private readonly fastify: FastifyInstance) {
        this.routesRepository = new RoutesRepository(fastify);
    }

    async saveRoute(assignRoutesDto: AssignRoutesDto){
        try{
            // generating the coordinates from the google maps API
            const coordinates = await generateRoute(assignRoutesDto.startingLocation, assignRoutesDto.destinationLocation);
            const routesDto: RoutesDto = {
                vehicleId: assignRoutesDto.vehicleId,
                coordinates,
            };
            const newRoute = await this.routesRepository.saveRoutes(routesDto);
            if(newRoute){
                return{
                    success: true,
                    message: 'New Route is created successfully'
                }
            }
            return{
                success: false,
                message: 'Failed to create a new route'
            }
        }catch(error: any){
            console.error('Error in creating a new Vehicle: ', error.message);
            return{
                success: false,
                message: 'Failed to create a new Vehicle'
            }
        }
    }
    
    async getRoutes(vehicleId: string){
        try{
            const routes = await this.routesRepository.fetchRoutes(vehicleId);
            return{
                success: true,
                message: 'All routes are fetched successfully',
                routes: routes
            }
        }catch(error: any){
            console.error('Error in fetching all the Routes: ', error.message);
            return{
                success: false,
                message: 'Failed to fetch all the Routes'
            }
        }
    }

    async updateStatus(routesId: string, status: RouteStatus){
        try{
            await this.routesRepository.updateStatus(routesId, status);
            return{
                success: true,
                message: `Routes status is changed to ${status}`
            }
        }catch(error: any){
            console.error('Error in updating the status of the route: ', error.message);
            return {
                success: false,
                message: 'Failed to update the routes status'
            }
        }
    }
}