import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { FastifyInstance } from 'fastify';
import { LoginDto, RegisterDto } from '../dtos/auth.dto';
import bcrypt from 'bcrypt';

export class AuthService {
  private userRepository: Repository<User>;

  constructor(fastify: FastifyInstance) {
    this.userRepository = fastify.db.getRepository(User);
  }

  async register(registerDto: RegisterDto) {
    try{
        // check if user exists
        const existingUser = await this.userRepository.findOne({ where: { email: registerDto.email}});

        if(existingUser){
            
        }
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    }catch(error){

    }
    const role = await this.roleRepository.findOne({ where: { name: role } });
    if (!role) throw new Error('Role not found');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      username,
      email,
      password: hashedPassword,
      role,
      roleId: role.id,
    });

    return await this.userRepository.save(user);
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
      relations: ['role'],
    });
    if (!user) throw new Error('User not found');

    const isValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isValid) throw new Error('Invalid credentials');

    return user;
  }
}