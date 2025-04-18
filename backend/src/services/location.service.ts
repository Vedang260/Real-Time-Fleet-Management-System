import { FastifyInstance } from "fastify";
import { LocationRepository } from "../repositories/location.repository";
import { LocationDto } from "../dtos/location.dto";

export class LocationService{
    private locationRepository: LocationRepository;

    constructor(private readonly fastify: FastifyInstance) {
        this.locationRepository = new LocationRepository(fastify);
    }

    async saveLocation(locationDto: LocationDto){
        try{
            const newLocation = await this.locationRepository.saveLocation(locationDto);
            if(newLocation)
                return{
                    success: true,
                    message: 'Location is saved successfully'
                }
            return{
                success: false,
                message: 'Failed to save the location'
            }
        }catch(error: any){
            console.error('Error in saving the location: ', error.message);
            return {
                success: false,
                message: 'Failed to save the location'
            }
        }
    }

    async getLocationHistory(vehicleId: string){
        try{
            
        }catch(error: any){
            console.error('Error in fetching the location History: ', error.message);
            return{
                success: false,
                message: 'Failed to fetch the  location History'
            }
        }
    }
}