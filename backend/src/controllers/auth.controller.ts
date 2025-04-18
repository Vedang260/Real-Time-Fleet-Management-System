import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from '../services/auth.service';
import { LoginDto, RegisterDto } from '../dtos/auth.dto';

export class AuthController {
    private authService = new AuthService();

    register = async ( request: FastifyRequest<{ Body: RegisterDto }>, reply: FastifyReply ) => {
        const result = await this.authService.register(request.body);
        reply.send(result.data);
    }

    login = async (request: FastifyRequest<{ Body: LoginDto }>, reply: FastifyReply) => {
        const result = await this.authService.login(request.body);
        reply.send(result.data);
    }
}