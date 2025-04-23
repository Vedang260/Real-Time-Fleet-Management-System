import { FastifyInstance } from "fastify";
import { Routes } from "../entities/routes.entity";
import { Repository } from "typeorm";
import { RoutesDto } from "../dtos/routes.dto";
import { RouteStatus } from "../enums/routeStatus.enums";

export class RoutesRepository{
    private routesRepository: Repository<Routes>;
    
    constructor(fastify: FastifyInstance) {
        // Check if the fastify.db is correctly initialized
        if (!fastify.db) {
            throw new Error("Database connection not established.");
        }
        this.routesRepository = fastify.db.getRepository(Routes);
    }

    async saveRoutes(routesDto: RoutesDto): Promise<Routes | null> {
        try{
            const newRoute = this.routesRepository.create(routesDto);
            return await this.routesRepository.save(newRoute);
        }catch(error: any){
            console.error('Error in creating a new Route for the Vehicle: ', error.message);
            throw new error('Error in creating a new Route for the Vehicle');
        }
    }

    async fetchRoutes(vehicleId: string): Promise<Routes[] | null>{
        try{
            return await this.routesRepository.find({ where: {vehicleId, status: RouteStatus.PENDING}});
        }catch(error: any){
            console.error('Error in fetching Routes for the Vehicle: ', error.message);
            throw new error('Error in fetching Routes for the Vehicle');
        }
    }

    async updateStatus(routesId: string, status: RouteStatus){
        try{
            return await this.routesRepository.update(
                { routesId },
                { status }
            );
        }catch(error: any){
            console.error('Error in updating the status for the Route: ', error.message);
            throw new error('Error in updating the status for the Route');
        }
    }

    async getRoute(routesId: string): Promise<Routes | null>{
        try{
            return await this.routesRepository.findOne({ where: {routesId}});
        }catch(error: any){
            console.error('Error in fetching the routes: ', error.message);
            throw new error('Error in fetching the routes');   
        }
    }

}