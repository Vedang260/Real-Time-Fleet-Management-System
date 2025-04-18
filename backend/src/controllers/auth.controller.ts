import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from '../services/auth.service';
import { LoginDto, RegisterDto } from '../dtos/auth.dto';

export class AuthController {
  private authService: AuthService;

  constructor(fastify: FastifyInstance) {
    this.authService = new AuthService(fastify);
  }

  async register(
    request: FastifyRequest<{ Body: RegisterDto }>,
    reply: FastifyReply
  ) {
    const { username, email, password, role } = request.body;
    const user = await this.authService.register(username, email, password, roleName);
    const token = request.server.jwt.sign({ id: user.id, role: user.role.name });
    reply.send({ user, token });
  }

  async login(request: FastifyRequest<{ Body: LoginDto }>, reply: FastifyReply) {
    const user = await this.authService.login(request.body);
    const token = request.server.jwt.sign({ id: user.id, role: user.role.name });
    reply.send({ user, token });
  }
}