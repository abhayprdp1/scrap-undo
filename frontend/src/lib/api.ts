import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token from localStorage if present
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('scrapundo_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Demo fallback data for Kerala cities (Kochi, Palakkad, Malappuram, Thrissur)
export const KERALA_CITIES = ['Kochi', 'Palakkad', 'Malappuram', 'Thrissur'] as const;

export const DEMO_RATES = [
  // Electronics
  { id: '1', category: 'Electronics', subcategory: 'CRT TV', cityZone: 'Kochi', unit: 'piece', minRate: 250, maxRate: 550 },
  { id: '2', category: 'Electronics', subcategory: 'LCD/LED TV', cityZone: 'Kochi', unit: 'piece', minRate: 350, maxRate: 900 },
  { id: '3', category: 'Electronics', subcategory: 'Laptop / Dead PC', cityZone: 'Kochi', unit: 'piece', minRate: 850, maxRate: 3200 },
  { id: '4', category: 'Electronics', subcategory: 'Mobile Phone', cityZone: 'Kochi', unit: 'piece', minRate: 120, maxRate: 600 },
  { id: '5', category: 'Electronics', subcategory: 'Refrigerator', cityZone: 'Kochi', unit: 'piece', minRate: 600, maxRate: 1800 },
  { id: '6', category: 'Electronics', subcategory: 'Washing Machine', cityZone: 'Kochi', unit: 'piece', minRate: 500, maxRate: 1400 },
  { id: '7', category: 'Electronics', subcategory: 'Mixed Cables & Wires', cityZone: 'Kochi', unit: 'kg', minRate: 35, maxRate: 90 },

  // Metal
  { id: '8', category: 'Metal', subcategory: 'Copper Wire / Pipes', cityZone: 'Kochi', unit: 'kg', minRate: 460, maxRate: 560 },
  { id: '9', category: 'Metal', subcategory: 'Brass (Pithala)', cityZone: 'Kochi', unit: 'kg', minRate: 290, maxRate: 380 },
  { id: '10', category: 'Metal', subcategory: 'Aluminium Vessels / Frames', cityZone: 'Kochi', unit: 'kg', minRate: 85, maxRate: 120 },
  { id: '11', category: 'Metal', subcategory: 'Iron / Steel (Irumbu)', cityZone: 'Kochi', unit: 'kg', minRate: 26, maxRate: 36 },

  // Paper & Cardboard
  { id: '12', category: 'Paper', subcategory: 'Newspaper (Pathram)', cityZone: 'Kochi', unit: 'kg', minRate: 13, maxRate: 17 },
  { id: '13', category: 'Paper', subcategory: 'Cardboard Cartons', cityZone: 'Kochi', unit: 'kg', minRate: 9, maxRate: 13 },
  { id: '14', category: 'Paper', subcategory: 'Office Books / Files', cityZone: 'Kochi', unit: 'kg', minRate: 10, maxRate: 14 },

  // Plastic
  { id: '15', category: 'Plastic', subcategory: 'PET Water Bottles', cityZone: 'Kochi', unit: 'kg', minRate: 10, maxRate: 16 },
  { id: '16', category: 'Plastic', subcategory: 'HDPE Hard Plastic', cityZone: 'Kochi', unit: 'kg', minRate: 8, maxRate: 12 },
];

export interface ScrapShop {
  id: string;
  shopName: string;
  phone: string;
  city: string;
  area: string;
  categories: string[];
  ratingAvg: number;
  totalRatings: number;
  serviceRadiusKm: number;
  distanceKm: number;
  lat: number;
  lng: number;
  address: string;
  isOpenToday: boolean;
  timings: string;
}

export const DEMO_DEALERS: ScrapShop[] = [
  {
    id: 'shop-koc-1',
    shopName: 'Cochin Green Recyclers & Scrap Mart',
    phone: '+91 94470 12345',
    city: 'Kochi',
    area: 'Kakkanad / Edappally',
    categories: ['Electronics', 'Metal', 'Paper', 'Plastic'],
    ratingAvg: 4.9,
    totalRatings: 58,
    serviceRadiusKm: 15,
    distanceKm: 1.8,
    lat: 10.0261,
    lng: 76.3125,
    address: 'Near InfoPark Gate, Kakkanad, Kochi, Kerala 682030',
    isOpenToday: true,
    timings: '8:00 AM – 7:30 PM',
  },
  {
    id: 'shop-koc-2',
    shopName: 'Kochi Metro E-Waste & Metal Traders',
    phone: '+91 98460 67890',
    city: 'Kochi',
    area: 'Palarivattom / Vyttila',
    categories: ['Electronics', 'Metal'],
    ratingAvg: 4.7,
    totalRatings: 39,
    serviceRadiusKm: 18,
    distanceKm: 3.2,
    lat: 9.9982,
    lng: 76.3079,
    address: 'Bypass Junction, Palarivattom, Kochi, Kerala 682025',
    isOpenToday: true,
    timings: '8:30 AM – 7:00 PM',
  },
  {
    id: 'shop-koc-3',
    shopName: 'Aluva Eco Metal & Paper Depot',
    phone: '+91 98471 99881',
    city: 'Kochi',
    area: 'Aluva / Kalamassery',
    categories: ['Metal', 'Paper', 'Plastic'],
    ratingAvg: 4.8,
    totalRatings: 27,
    serviceRadiusKm: 15,
    distanceKm: 5.4,
    lat: 10.1076,
    lng: 76.3516,
    address: 'Industrial Belt, Near Metro Pillar 140, Aluva, Kerala 683101',
    isOpenToday: true,
    timings: '8:00 AM – 8:00 PM',
  },
  {
    id: 'shop-plk-1',
    shopName: 'Palakkad Green Clean Scrap Yard',
    phone: '+91 94471 23456',
    city: 'Palakkad',
    area: 'TB Road / Olavakkode',
    categories: ['Electronics', 'Metal', 'Paper'],
    ratingAvg: 4.8,
    totalRatings: 44,
    serviceRadiusKm: 16,
    distanceKm: 2.4,
    lat: 10.7967,
    lng: 76.6436,
    address: 'Opp. Railway Goods Shed, Olavakkode, Palakkad, Kerala 678002',
    isOpenToday: true,
    timings: '8:00 AM – 8:00 PM',
  },
  {
    id: 'shop-plk-2',
    shopName: 'Kanjikode Industrial Recyclers',
    phone: '+91 98472 33445',
    city: 'Palakkad',
    area: 'Kanjikode Industrial Area',
    categories: ['Metal', 'Electronics', 'Plastic'],
    ratingAvg: 4.9,
    totalRatings: 52,
    serviceRadiusKm: 20,
    distanceKm: 7.1,
    lat: 10.7932,
    lng: 76.7445,
    address: 'Industrial Growth Centre, Kanjikode, Palakkad, Kerala 678621',
    isOpenToday: true,
    timings: '8:00 AM – 7:00 PM',
  },
  {
    id: 'shop-mlp-1',
    shopName: 'Malappuram Eco Recyclers & Metals',
    phone: '+91 94472 34567',
    city: 'Malappuram',
    area: 'Down Hill / Kottakkal',
    categories: ['Electronics', 'Metal', 'Paper', 'Plastic'],
    ratingAvg: 4.8,
    totalRatings: 36,
    serviceRadiusKm: 18,
    distanceKm: 2.9,
    lat: 11.0722,
    lng: 76.0740,
    address: 'Near Town Hall, Down Hill, Malappuram, Kerala 676505',
    isOpenToday: true,
    timings: '8:30 AM – 7:30 PM',
  },
  {
    id: 'shop-mlp-2',
    shopName: 'Kottakkal Scrap Collection Depot',
    phone: '+91 98473 66778',
    city: 'Malappuram',
    area: 'Kottakkal / Edarikkode',
    categories: ['Metal', 'Paper', 'Electronics'],
    ratingAvg: 4.7,
    totalRatings: 29,
    serviceRadiusKm: 14,
    distanceKm: 6.8,
    lat: 11.0006,
    lng: 75.9984,
    address: 'Changuvetti Junction, Kottakkal, Malappuram, Kerala 676503',
    isOpenToday: true,
    timings: '9:00 AM – 8:00 PM',
  },
  {
    id: 'shop-tsr-1',
    shopName: 'Thrissur City Scrap & E-Waste Hub',
    phone: '+91 94473 45678',
    city: 'Thrissur',
    area: 'Round West / Ollur Industrial Belt',
    categories: ['Electronics', 'Metal', 'Paper'],
    ratingAvg: 4.9,
    totalRatings: 63,
    serviceRadiusKm: 16,
    distanceKm: 2.1,
    lat: 10.5276,
    lng: 76.2144,
    address: 'Near Mission Quarters, Thrissur, Kerala 680001',
    isOpenToday: true,
    timings: '8:00 AM – 7:30 PM',
  },
  {
    id: 'shop-tsr-2',
    shopName: 'Ollur Eco Scrap & Copper Traders',
    phone: '+91 98474 88990',
    city: 'Thrissur',
    area: 'Ollur Industrial Estate',
    categories: ['Metal', 'Electronics', 'Plastic'],
    ratingAvg: 4.8,
    totalRatings: 41,
    serviceRadiusKm: 18,
    distanceKm: 4.5,
    lat: 10.4851,
    lng: 76.2372,
    address: 'Industrial Estate Road, Ollur, Thrissur, Kerala 680306',
    isOpenToday: true,
    timings: '8:00 AM – 8:00 PM',
  },
];
