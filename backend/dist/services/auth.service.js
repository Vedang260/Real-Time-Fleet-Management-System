"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_repository_1 = require("../repositories/user.repository");
class AuthService {
    constructor(fastify) {
        this.fastify = fastify;
        this.userRepository = new user_repository_1.UserRepository(fastify);
    }
    async register(registerDto) {
        try {
            // check if user exists
            const existingUser = await this.userRepository.findByEmail(registerDto.email);
            // if user already exists
            if (existingUser) {
                return {
                    success: false,
                    message: 'User already exists'
                };
            }
            // if new user then hash the password
            const hashedPassword = await bcrypt_1.default.hash(registerDto.password, 10);
            registerDto.password = hashedPassword;
            // create a new user
            const newUser = await this.userRepository.createUser(registerDto);
            if (newUser) {
                return {
                    success: true,
                    message: 'User is registered successfully'
                };
            }
            return {
                success: false,
                message: 'Failed to register user'
            };
        }
        catch (error) {
            console.error('Error in user registeration: ', error.message);
            return {
                success: false,
                message: 'Failed to register the user'
            };
        }
    }
    async login(loginDto) {
        try {
            // find whether the user exists or not
            const user = await this.userRepository.findByEmail(loginDto.email);
            if (!user) {
                return {
                    success: false,
                    message: 'User does not exist'
                };
            }
            // check if password is correct
            const isValid = await bcrypt_1.default.compare(loginDto.password, user.password);
            if (!isValid)
                return {
                    success: false,
                    message: 'Invalid Credentials'
                };
            // if user is valid, then generate a token
            const token = this.fastify.jwt.sign({ id: user.userId, username: user.username, role: user.role }, { expiresIn: '1h' });
            return {
                success: true,
                message: 'User is logged in successfully',
                token: token
            };
        }
        catch (error) {
            console.error('Error in login: ', error.message);
            return {
                success: false,
                message: 'Failed to login'
            };
        }
    }
}
exports.AuthService = AuthService;
