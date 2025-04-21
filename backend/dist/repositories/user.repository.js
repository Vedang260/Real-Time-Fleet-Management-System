"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const user_entity_1 = require("../entities/user.entity");
class UserRepository {
    constructor(fastify) {
        // Check if the fastify.db is correctly initialized
        if (!fastify.db) {
            throw new Error("Database connection not established.");
        }
        this.repository = fastify.db.getRepository(user_entity_1.User);
    }
    async findByEmail(email) {
        try {
            return this.repository.findOne({ where: { email } });
        }
        catch (error) {
            console.error('Error in finding a user by email: ', error.message);
            throw new error('Error in finding a user by email');
        }
    }
    async createUser(registerDto) {
        try {
            const newUser = this.repository.create(registerDto);
            return await this.repository.save(newUser);
        }
        catch (error) {
            console.error('Error in creating a new User: ', error.message);
            throw new error('Error in creating a new User');
        }
    }
}
exports.UserRepository = UserRepository;
