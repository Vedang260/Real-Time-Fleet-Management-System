export interface Driver{
    username: string;
}

export interface Vehicle{
    vehicleId: string;
    licensePlate: string;
    model: string;
    type: string;
    status: string;
    driverId: string;
    createdAt: string;
    updatedAt: string;
    driver: Driver;
}

export interface GetVehiclesResponse{
    success: boolean;
    message: string;
    vehicles: Vehicle[];
}