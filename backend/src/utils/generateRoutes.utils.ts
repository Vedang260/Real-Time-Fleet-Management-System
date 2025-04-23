import axios from 'axios';
import * as polyline from '@mapbox/polyline';
import dotenv from 'dotenv';
import { LocationPoint } from '../dtos/routes.dto';

dotenv.config();

export async function generateRoute(startLocation: LocationPoint, destinationLocation: LocationPoint) {
    try{
        const apiKey = process.env.GOOGLE_API_KEY;
        const origin = `${startLocation.latitude},${startLocation.longitude}`;
        const destination = `${destinationLocation.latitude},${destinationLocation.longitude}`;

        const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&mode=driving&key=${apiKey}`;

        const response = await axios.get(url);
        const route = response.data.routes[0];
        console.log("Generated routes: ", route);
        if (!route || !route.overview_polyline) {
            throw new Error('No route found from Google Maps API');
        }

        const encodedPolyline = route.overview_polyline.points;
        const decodedCoords = polyline
            .toGeoJSON(encodedPolyline)
            .coordinates.map(([longitude, latitude]) => ({ latitude, longitude }));

        return decodedCoords;
    }catch(error: any){
        console.log('Error in generation routes: ', error.message);
        throw new Error('Failed to generate the routes');
    }
}
