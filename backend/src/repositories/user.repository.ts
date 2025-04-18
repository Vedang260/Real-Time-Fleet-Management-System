import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { FastifyInstance } from "fastify";

export class UserRepository{
    private repository: Repository<User>;

    constructor(fastify: FastifyInstance){
        this.repository = fastify.db.getRepository(User);
    }
}