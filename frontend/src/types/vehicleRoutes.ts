
export interface LocationPoint{
    latitude: number;
    longitude: number;
}

export interface Routes extends LocationPoint{
    routesId: string;
    vehicleId: string;
    startingPlaceName: string;
    destinationPlaceName: string;
    coordinates: LocationPoint[];
    status: string;
    createdAt: string;
}

export interface RoutesResponse{
    success: boolean;
    message: string;
    routes: Routes[];
}