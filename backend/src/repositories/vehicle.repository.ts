import { Repository } from "typeorm";
import { Vehicle } from "../entities/vehicle.entity";
import { FastifyInstance } from "fastify";
import { VehicleDto } from "../dtos/vehicle.dto";

export class VehicleRepository{
    private repository: Repository<Vehicle>;

    constructor(fastify: FastifyInstance) {
        // Check if the fastify.db is correctly initialized
        if (!fastify.db) {
            throw new Error("Database connection not established.");
        }
        this.repository = fastify.db.getRepository(Vehicle);
    }

    // async findById(vehicleId: string): Promise<Vehicle | null>{
    //     try{
    //         return this.repository.findOne({ where: {vehicleId}});
    //     }catch(error: any){
    //         console.error('Error in finding a user by email: ', error.message);
    //         throw new error('Error in finding a user by email');
    //     }
    // }

    async createVehicle(vehicleDto: VehicleDto) : Promise<Vehicle | null>{
        try{
            const newVehicle = this.repository.create(vehicleDto);
            return await this.repository.save(newVehicle);
        }catch(error: any){
            console.error('Error in creating a new Vehicle: ', error.message);
            throw new error('Error in creating a new Vehicle');
        }
    }

    async getAllVehicles() : Promise<Vehicles[] | null>{
        try{

        }catch(error: any){
            console.error('Error in fetching all the vehicles: ', error.message);
            throw new error('Error in fetching all the vehicles');
        }
    }

    async deleteVehicle(vehicleId: string) {
        try{
            await this.repository.delete(vehicleId);
        }catch(error: any){
            console.error('Error in deleting a vehicle: ', error.message);
            throw new error('Error in deleting a vehicle');
        }
    }

    async getVehiclesByDriver(driverId: string) {
        try{

        }catch(error: any){
            console.error('Error in fetching a vehicle by DriverId: ', error.message);
            throw new error('Error in fetching a vehicle by DriverId');
        }
    }

    async updateVehicleStatus(vehicleId: string){
        try{

        }catch(error: any){
            console.error('Error in updating vehicle status: ', error.message);
            throw new error('Error in updating vehicle status');
        }
    }
}