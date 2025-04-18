import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import fastify, { FastifyInstance } from 'fastify';
import { LoginDto, RegisterDto } from '../dtos/auth.dto';
import bcrypt from 'bcrypt';
import { UserRepository } from '../repositories/user.repository';

export class AuthService {
  private userRepository: UserRepository;

  constructor(fastify: FastifyInstance) {
    this.userRepository = new UserRepository(fastify);
  }

  async register(registerDto: RegisterDto) {
    try{
        // check if user exists
        const existingUser = await this.userRepository.findByEmail(registerDto.email);

        // if user already exists
        if(existingUser){
            return{
                success: false,
                message: 'User already exists'
            }
        }
        // if new user then hash the password
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        registerDto.password = hashedPassword;

        // create a new user
        const newUser = await this.userRepository.createUser(registerDto);
        if(newUser){
            return {
                success: true,
                message: 'User is registered successfully'
            }
        }
        return {
            success: false,
            message: 'Failed to register user'
        }
    }catch(error: any){
        console.error('Error in user registeration: ', error.message);
        return {
            success: false,
            message: 'Failed to register the user'
        }
    }

  }
}


