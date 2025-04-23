import { google } from 'googleapis';
import * as polyline from '@mapbox/polyline';

export async function generateRoute(startLocation: { lat: number; lng: number }, destinationLocation: { lat: number; lng: number }) {
  const maps = google.maps({ version: '3.45', auth: process.env.GOOGLE_API_KEY });

  const directionsResponse = await maps.directions({
    params: {
      origin: `${startLocation.lat},${startLocation.lng}`,
      destination: `${destinationLocation.lat},${destinationLocation.lng}`,
      mode: 'driving',
      key: process.env.GOOGLE_API_KEY,
    },
  });

  const route = directionsResponse.data.routes[0];
  if (!route) throw new Error('No route found from Google Maps API');

  const encodedPolyline = route.overview_polyline.points;
  const decodedCoords = polyline.toGeoJSON(encodedPolyline).coordinates.map(([lng, lat]) => ({
    lat,
    lng,
  }));

  return decodedCoords;
}
