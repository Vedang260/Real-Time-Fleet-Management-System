"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationService = void 0;
const location_repository_1 = require("../repositories/location.repository");
class LocationService {
    constructor(fastify) {
        this.fastify = fastify;
        this.locationRepository = new location_repository_1.LocationRepository(fastify);
    }
    async saveLocation(locationDto) {
        try {
            const newLocation = await this.locationRepository.saveLocation(locationDto);
            if (newLocation)
                return {
                    success: true,
                    message: 'Location is saved successfully'
                };
            return {
                success: false,
                message: 'Failed to save the location'
            };
        }
        catch (error) {
            console.error('Error in saving the location: ', error.message);
            return {
                success: false,
                message: 'Failed to save the location'
            };
        }
    }
    async getLocationHistory(vehicleId) {
        try {
        }
        catch (error) {
            console.error('Error in fetching the location History: ', error.message);
            return {
                success: false,
                message: 'Failed to fetch the  location History'
            };
        }
    }
}
exports.LocationService = LocationService;
