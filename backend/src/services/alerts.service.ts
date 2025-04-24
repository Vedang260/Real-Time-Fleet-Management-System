import { FastifyInstance } from "fastify";
import { AlertsRepository } from "../repositories/alert.repository";
import { AlertDto } from "../dtos/alert.dto";

export class AlertsService{
    private alertsRepository: AlertsRepository;

    constructor(private readonly fastify: FastifyInstance) {
        this.alertsRepository = new AlertsRepository(fastify);
    }

    async saveAlert(alertDto: AlertDto){
        try{
            const newAlert = await this.alertsRepository.saveAlert(alertDto);
            if(newAlert)
                return{
                    success: true,
                    message: 'Alert is saved successfully'
                }
            return{
                success: false,
                message: 'Failed to save the alert'
            }
        }catch(error: any){
            console.error('Error in saving the alert: ', error.message);
            return {
                success: false,
                message: 'Failed to save the alert'
            }
        }
    }
}