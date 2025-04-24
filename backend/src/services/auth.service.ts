import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import fastify, { FastifyInstance } from 'fastify';
import { LoginDto, RegisterDto } from '../dtos/auth.dto';
import bcrypt from 'bcrypt';
import { UserRepository } from '../repositories/user.repository';
import jwt from '../plugins/jwt';

export class AuthService {
  private userRepository: UserRepository;

  constructor(private readonly fastify: FastifyInstance) {
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

  async login(loginDto: LoginDto){
    try{
        // find whether the user exists or not
        const user = await this.userRepository.findByEmail(loginDto.email);

        if(!user){
            return{
                success: false,
                message: 'User does not exist',
                userId: null,
                username: null,
                role: null
            }
        }

        // check if password is correct
        const isValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isValid) 
            return{
                success: false,
                message: 'Invalid Credentials'
            }

        // if user is valid, then generate a token
        const token = this.fastify.jwt.sign({ id: user.userId, username: user.username, role: user.role }, {expiresIn: '1h'});

        return{
            success: true,
            message: 'User is logged in successfully',
            token: token,
            userId: user.userId,
            username: user.username,
            role: user.role
        }
    }catch(error: any){
        console.error('Error in login: ', error.message);
        return{
            success: false,
            message: 'Failed to login'
        }
    }
  }

  async getDrivers(){
    try{
        const driversList = await this.userRepository.getDrivers();
        return{
            success: true,
            message: "Drivers list is fetched",
            driversList: driversList 
        } 
    }catch(error: any){
        console.error('Error in fetching the drivers list: ', error.message);
        return{
            success: false,
            message: 'Failed to fetch the drivers'
        }
    }
  }
}


