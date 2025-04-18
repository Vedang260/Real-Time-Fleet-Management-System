import { Repository } from "typeorm";
import { FastifyInstance } from "fastify";
import { LocationDto } from "../dtos/location.dto";
import { Location } from "../entities/location.entity";

export class LocationRepository{
    private locationsRepository: Repository<Location>;

    constructor(fastify: FastifyInstance){
        this.locationsRepository = fastify.db.getRepository(Location);
    }   
    
    async saveLocation(locationDto: LocationDto){
        try{
            const newLocation = this.locationsRepository.create(locationDto);
            return await this.locationsRepository.save(newLocation);
        }catch(error: any){
            console.error('Error in creating adding a new Location: ', error.message);
            throw new error('Failed to add a new Location');
        }
    }

    async getLocationHistory(vehicleId: string){
        try{
            return await this.locationsRepository.find();
        }catch(error){

        }
    }
}