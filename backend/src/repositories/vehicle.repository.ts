import { Repository } from "typeorm";
import { Vehicle } from "../entities/vehicle.entity";
import { FastifyInstance } from "fastify";
import { VehicleDto } from "../dtos/vehicle.dto";
import { VehicleStatus } from "../enums/vehicleStatus.enums";

export class VehicleRepository{
    private repository: Repository<Vehicle>;

    constructor(fastify: FastifyInstance) {
        // Check if the fastify.db is correctly initialized
        if (!fastify.db) {
            throw new Error("Database connection not established.");
        }
        this.repository = fastify.db.getRepository(Vehicle);
    }

    async createVehicle(vehicleDto: VehicleDto) : Promise<Vehicle | null>{
        try{
            const newVehicle = this.repository.create(vehicleDto);
            return await this.repository.save(newVehicle);
        }catch(error: any){
            console.error('Error in creating a new Vehicle: ', error.message);
            throw new error('Error in creating a new Vehicle');
        }
    }

    async getAllVehicles() : Promise<Vehicle[] | null>{
        try{
            return await this.repository
            .createQueryBuilder('vehicle')
            .leftJoinAndSelect('vehicle.driver', 'users')
            .select([
                'vehicle',
                'users.username' 
            ])
            .getMany();
        }catch(error: any){
            console.error('Error in fetching all the vehicles: ', error.message);
            throw new error('Error in fetching all the vehicles');
        }
    }

    async deleteVehicle(vehicleId: string) {
        try{
            const result = await this.repository.delete(vehicleId);
            if (result.affected === 0) {
                throw new Error('Vehicle not found');
            }
        }catch(error: any){
            console.error('Error in deleting a vehicle: ', error.message);
            throw new error('Error in deleting a vehicle');
        }
    }

    async getVehiclesByDriver(driverId: string): Promise<Vehicle[] | null> {
        try{
            return await this.repository.find({ where: { driverId } });
        }catch(error: any){
            console.error('Error in fetching a vehicle by DriverId: ', error.message);
            throw new error('Error in fetching a vehicle by DriverId');
        }
    }

    async updateVehicleStatus(vehicleId: string, status: VehicleStatus){
        try{
            const vehicle = await this.repository.findOne({ where: { vehicleId } });
            if (!vehicle) throw new Error("Vehicle not found");

            vehicle.status = status;
            return await this.repository.save(vehicle);
        }catch(error: any){
            console.error('Error in updating vehicle status: ', error.message);
            throw new error('Error in updating vehicle status');
        }
    }
}