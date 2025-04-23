import { FastifyInstance } from "fastify";
import { RoutesRepository } from "../repositories/routes.repository";
import { AssignRoutesDto } from "../dtos/routes.dto";

export class RoutesService{
    private routesRepository: RoutesRepository;

    constructor(private readonly fastify: FastifyInstance) {
        this.routesRepository = new RoutesRepository(fastify);
    }

    async saveRoute(assignRoutesDto: AssignRoutesDto){
        try{
            const newVehicle = await this.vehicleRepository.createVehicle(vehicleDto);
            if(newVehicle){
                return{
                    success: true,
                    message: 'New Vehicle is created successfully'
                }
            }
            return{
                success: false,
                message: 'Failed to create a new vehicle'
            }
        }catch(error: any){
            console.error('Error in creating a new Vehicle: ', error.message);
            return{
                success: false,
                message: 'Failed to create a new Vehicle'
            }
        }
    }
    
    async getAllVehicles(){
        try{
            const vehicles = await this.vehicleRepository.getAllVehicles();
            return{
                success: true,
                message: 'All vehicles are fetched successfully',
                vehicles: vehicles
            }
        }catch(error: any){
            console.error('Error in fetching all the vehicles: ', error.message);
            return{
                success: false,
                message: 'Failed to fetch all the vehicles'
            }
        }
    }
}