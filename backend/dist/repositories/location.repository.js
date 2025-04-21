"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationRepository = void 0;
const location_entity_1 = require("../entities/location.entity");
class LocationRepository {
    constructor(fastify) {
        this.locationsRepository = fastify.db.getRepository(location_entity_1.Location);
    }
    async saveLocation(locationDto) {
        try {
            const newLocation = this.locationsRepository.create(locationDto);
            return await this.locationsRepository.save(newLocation);
        }
        catch (error) {
            console.error('Error in creating adding a new Location: ', error.message);
            throw new error('Failed to add a new Location');
        }
    }
    async getLocationHistory(vehicleId) {
        try {
            return await this.locationsRepository.find();
        }
        catch (error) {
        }
    }
}
exports.LocationRepository = LocationRepository;
