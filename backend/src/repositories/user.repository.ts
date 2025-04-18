import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { FastifyInstance } from "fastify";
import { RegisterDto } from "../dtos/auth.dto";

export class UserRepository{
    private repository: Repository<User>;

    constructor(fastify: FastifyInstance){
        this.repository = fastify.db.getRepository(User);
    }

    async findByEmail(email: string): Promise<User | null>{
        try{
            return this.repository.findOne({ where: {email}});
        }catch(error: any){
            console.error('Error in finding a user by email: ', error.message);
            throw new error('Error in finding a user by email');
        }
    }

    async createUser(registerDto: RegisterDto) : Promise<User>{
        try{
            const newUser = this.repository.create(registerDto);
            return await this.repository.save(newUser);
        }catch(error: any){
            console.error('Error in creating a new User: ', error.message);
            throw new error('Error in creating a new User');
        }
    }
}