// Haversine formula to compute great-circle distance between two GPS coordinates in kilometers
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10;
}

export interface UserGeoLocation {
  latitude: number;
  longitude: number;
  accuracyMeters?: number;
  formattedAddress?: string;
  detectedCity?: 'Kochi' | 'Palakkad' | 'Malappuram' | 'Thrissur' | string;
}

// Request real GPS location via browser Geolocation API
export async function getRealUserLocation(): Promise<UserGeoLocation> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        let formattedAddress = `${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° E (GPS)`;
        let detectedCity: any = 'Kochi';

        // Reverse-geocode coordinates to real Kerala street address
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            {
              headers: {
                'Accept-Language': 'en',
              },
            }
          );
          if (res.ok) {
            const data = await res.json();
            if (data && data.address) {
              const road = data.address.road || data.address.suburb || data.address.neighbourhood || '';
              const city = data.address.city || data.address.town || data.address.county || data.address.state_district || '';
              const state = data.address.state || 'Kerala';
              const postcode = data.address.postcode ? `, ${data.address.postcode}` : '';
              
              formattedAddress = [road, city, state + postcode].filter(Boolean).join(', ');

              // Match detected district
              const addrLower = (city + ' ' + (data.address.county || '')).toLowerCase();
              if (addrLower.includes('palakkad')) detectedCity = 'Palakkad';
              else if (addrLower.includes('malappuram')) detectedCity = 'Malappuram';
              else if (addrLower.includes('thrissur')) detectedCity = 'Thrissur';
              else if (addrLower.includes('kochi') || addrLower.includes('ernakulam')) detectedCity = 'Kochi';
            }
          }
        } catch (err) {
          console.warn('Reverse geocoding failed, using coordinates', err);
        }

        resolve({
          latitude,
          longitude,
          accuracyMeters: accuracy,
          formattedAddress,
          detectedCity,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  });
}
