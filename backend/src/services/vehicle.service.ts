import { FastifyInstance } from "fastify";
import { VehicleRepository } from "../repositories/vehicle.repository";
import { VehicleDto } from "../dtos/vehicle.dto";

export class VehicleService{
    private vehicleRepository: VehicleRepository;

    constructor(private readonly fastify: FastifyInstance) {
        this.vehicleRepository = new VehicleRepository(fastify);
    }

    async createVehicle(vehicleDto: VehicleDto){
        try{
            const newVehicle = await this.vehicleRepository.createVehicle(vehicleDto);
            if(newVehicle){
                return{
                    success: true,
                    message: 'New Vehicle is created successfully'
                }
            }
            return{
                success: false,
                message: 'Failed to create a new vehicle'
            }
        }catch(error: any){
            console.error('Error in creating a new Vehicle: ', error.message);
            return{
                success: false,
                message: 'Failed to create a new Vehicle'
            }
        }
    }

    async getAllVehicles(){
        try{
            const vehicles = await this.vehicleRepository.getAllVehicles();
            return{
                success: true,
                message: 'All vehicles are fetched successfully',
                vehicles: vehicles
            }
        }catch(error: any){
            console.error('Error in fetching all the vehicles: ', error.message);
            return{
                success: false,
                message: 'Failed to fetch all the vehicles'
            }
        }
    }

    async getVehiclesByDriver(driverId: string){
        try{
            const vehicles = await this.vehicleRepository.getVehiclesByDriver(driverId);
            return{
                success: true,
                message: 'All vehicles are fetched successfully',
                vehicles: vehicles
            }
        }catch(error: any){
            console.error('Error in fetching a Vehicle by DriverId: ', error.message);
            return{
                success: false,
                message: 'Failed to fetch a Vehicle by DriverId'
            }
        }
    }

    async deleteVehicle(vehicleId: string){
        try{
            
        }catch(error: any){
            console.error('Error in deleting a vehicle: ', error.message);
            return{
                success: false,
                message: 'Failed to deleting a vehicle'
            }
        }
    }
}