import { Repository } from "typeorm";
import { FastifyInstance } from "fastify";

export class LocationRepository{
    private locationsRepository: Repository<Location>;

    constructor(fastify: FastifyInstance){
        this.locationsRepository = fastify.db.getRepository(Location);
    }   
    

}