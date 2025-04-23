export interface LocationPoint{
    latitude: number;
    longitude: number;
}

export interface AssignRoutesDto{
    vehicleId: string;
    startLocation: LocationPoint;
    destinationLocation: LocationPoint;
}