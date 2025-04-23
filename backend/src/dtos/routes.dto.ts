export interface LocationPoint{
    latitude: number;
    longitude: number;
}

export interface Places{
    startingPlaceName: string;
    destinationPlaceName: string;
}

export interface AssignRoutesDto extends Places{
    vehicleId: string;
    startingLocation: LocationPoint;
    destinationLocation: LocationPoint;
}

export interface RoutesDto extends Places{
    vehicleId: string;
    coordinates: LocationPoint[];   
}