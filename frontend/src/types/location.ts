export interface Location{
    vehicleId: string;
    latitude: number;
    longitude: number;
}

export interface LocationHistory{
    locationId: string;
    latitude: number;
    longitude: number;
    vehicleId: string;
    recordedAt: string;
}

export interface LocationHistoryResponse{
    success: boolean;
    message: string;
    locationHistory: LocationHistory[];
}