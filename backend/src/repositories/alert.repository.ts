import { Repository } from "typeorm";
import { FastifyInstance } from "fastify";
import { LocationDto } from "../dtos/location.dto";
import { Location } from "../entities/location.entity";
import { Alert } from "../entities/alert.entity";

export class AlertsRepository{
    private alertsRepository: Repository<Alert>;

    constructor(fastify: FastifyInstance){
        this.alertsRepository = fastify.db.getRepository(Alert);
    }   
    
    async saveAlert(locationDto: LocationDto): Promise<Alert>{
        try{
            const newLocation = this.alertsRepository.create(locationDto);
            return await this.alertsRepository.save(newLocation);
        }catch(error: any){
            console.error('Error in creating saving a new Location: ', error.message);
            throw new error('Failed to save a new Location');
        }
    }
}