export interface LocationDto{
    vehicleId: string;
    routesId: string;
    latitude: number;
    longitude: number;
}

export interface LocationMessageDto {
    type?: string
    vehicleId: string
    latitude?: number
    longitude?: number
  }