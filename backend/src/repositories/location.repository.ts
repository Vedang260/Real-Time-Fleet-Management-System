import { Repository } from "typeorm";
import { FastifyInstance } from "fastify";
import { LocationDto } from "../dtos/location.dto";
import { Location } from "../entities/location.entity";

export class LocationRepository{
    private locationsRepository: Repository<Location>;

    constructor(fastify: FastifyInstance){
        this.locationsRepository = fastify.db.getRepository(Location);
    }   
    
    async saveLocation(locationDto: LocationDto): Promise<Location>{
        try{
            const newLocation = this.locationsRepository.create(locationDto);
            return await this.locationsRepository.save(newLocation);
        }catch(error: any){
            console.error('Error in creating saving a new Location: ', error.message);
            throw new error('Failed to save a new Location');
        }
    }

    async getLocationHistory(vehicleId: string, routesId: string): Promise<Location[] | null>{
        try{
            return await this.locationsRepository.find({where: {vehicleId, routesId}});
        }catch(error: any){
            console.error('Error in fetching the Location History: ', error.message);
            throw new error('Failed to fetch the Location History');
        }
    }
}