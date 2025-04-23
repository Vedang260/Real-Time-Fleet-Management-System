import { FastifyInstance } from "fastify";
import { Routes } from "../entities/routes.entity";
import { Repository } from "typeorm";

export class routesRepository{
    private routesRepository: Repository<Routes>;
    
    constructor(fastify: FastifyInstance) {
        // Check if the fastify.db is correctly initialized
        if (!fastify.db) {
            throw new Error("Database connection not established.");
        }
        this.routesRepository = fastify.db.getRepository(Routes);
    }

    async saveRoutes() {
        try{

        }catch(error: any){
            
        }
    }
}