import { Repository } from "typeorm";
import { FastifyInstance } from "fastify";
import { Alert } from "../entities/alert.entity";
import { AlertDto } from "../dtos/alert.dto";

export class AlertsRepository{
    private alertsRepository: Repository<Alert>;

    constructor(fastify: FastifyInstance){
        this.alertsRepository = fastify.db.getRepository(Alert);
    }   
    
    async saveAlert(alertDto: AlertDto): Promise<Alert>{
        try{
            const newAlert = this.alertsRepository.create(alertDto);
            return await this.alertsRepository.save(newAlert);
        }catch(error: any){
            console.error('Error in saving a new Alert: ', error.message);
            throw new error('Failed to save a new Alert');
        }
    }
}