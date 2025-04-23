export interface LocationPoint{
    latitude: number;
    longitude: number;
}

export interface AssignRoutesDto{
    vehicleId: string;
    startingLocation: LocationPoint;
    destinationLocation: LocationPoint;
}

export interface RoutesDto{
    vehicleId: string;
    coordinates: LocationPoint[];   
}