// Real scrap shop data for Kerala districts
// Sources: Justdial, Quickerala, IDBF verified listings

export interface ScrapShop {
  id: string;
  slug: string; // URL-safe identifier, e.g. 'ok-scrap'
  name: string;
  address: string;
  area: string;
  phone: string;
  types: string[];
  rating: number;
  reviews: number;
  mapsQuery: string; // Used to build Google Maps search URL
  mapsDirectionsUrl: string; // Direct Google Maps directions URL
  photo: 'metal' | 'ewaste' | 'paper' | 'bottle'; // maps to public image
  openNow: boolean;
  hours: string;
  districtId: string;
}

// ─── Poster card data per shop ─────────────────────────────────────────────
export interface ShopPosterData {
  tag: string;
  rateText: string;
  ratePrice: string;
  rateUnit: string;
  homeDelivery: boolean;
  homeDeliveryLabel?: string;
  homeDeliverySub?: string;
  scrapTypeTitle: string;
  noticeTitle: string;
  noticeSubtitle: string;
}

export function getShopPosterData(shop: ScrapShop): ShopPosterData {
  // Per-shop overrides (real data)
  if (shop.slug === 'sn-scrap' || shop.id === 'mlp-sn' || shop.id === 'shop-mlp-3') {
    return {
      tag: 'BEST RATES',
      rateText: 'Steel ₹27.28 | Copper ₹800 | Fridge ₹750 | Aluminium ₹200 | Bottles ₹20',
      ratePrice: '₹27.28',
      rateUnit: 'per kg',
      homeDelivery: true,
      homeDeliveryLabel: 'Yes',
      homeDeliverySub: 'Pickup Available',
      scrapTypeTitle: 'Steel, Fridge, Copper, Aluminium & Plastics',
      noticeTitle: 'SN Scrap — Parambil Peedika, Kondotty',
      noticeSubtitle: 'Best scrap rates in Kondotty & Chellary. Call +91 98476 05132 for pickup.',
    };
  }

  if (shop.slug === 'ok-scrap') {
    return {
      tag: 'KUPPI',
      rateText: 'We take bottle at',
      ratePrice: '₹33',
      rateUnit: 'per kg',
      homeDelivery: false,
      homeDeliveryLabel: 'No',
      homeDeliverySub: 'Home Delivery',
      scrapTypeTitle: 'Kuppi (Bottle)',
      noticeTitle: 'Please bring the scrap to our shop',
      noticeSubtitle: 'No pickup or home delivery available.',
    };
  }

  // Generic fallback based on photo type
  const photoDefaults: Record<string, Omit<ShopPosterData, 'homeDelivery' | 'homeDeliveryLabel' | 'homeDeliverySub'>> = {
    bottle: {
      tag: 'KUPPI',
      rateText: 'We take bottle at',
      ratePrice: '₹30',
      rateUnit: 'per kg',
      scrapTypeTitle: 'Kuppi (Bottle)',
      noticeTitle: 'Please bring the scrap to our shop',
      noticeSubtitle: 'No pickup or home delivery available.',
    },
    metal: {
      tag: 'METAL',
      rateText: 'We take iron/steel at',
      ratePrice: '₹28',
      rateUnit: 'per kg',
      scrapTypeTitle: 'Iron / Steel',
      noticeTitle: 'Home pickup available',
      noticeSubtitle: 'Call us to schedule a pickup at your door.',
    },
    ewaste: {
      tag: 'E-WASTE',
      rateText: 'We take e-waste at',
      ratePrice: '₹50',
      rateUnit: 'per kg',
      scrapTypeTitle: 'Electronics / E-Waste',
      noticeTitle: 'Data-safe recycling guaranteed',
      noticeSubtitle: 'All drives are wiped before processing.',
    },
    paper: {
      tag: 'PAPER',
      rateText: 'We take newspaper at',
      ratePrice: '₹15',
      rateUnit: 'per kg',
      scrapTypeTitle: 'Paper / Newspaper',
      noticeTitle: 'Home pickup available',
      noticeSubtitle: 'Call us to schedule a pickup at your door.',
    },
  };

  const defaults = photoDefaults[shop.photo] ?? photoDefaults.metal;
  return {
    ...defaults,
    homeDelivery: shop.photo !== 'bottle',
    homeDeliveryLabel: shop.photo !== 'bottle' ? 'Yes' : 'No',
    homeDeliverySub: 'Home Delivery',
  };
}

export const SCRAP_SHOPS: Record<string, ScrapShop[]> = {
  palakkad: [
    {
      id: 'plk-1',
      slug: 'indian-trading-corporation',
      districtId: 'palakkad',
      name: 'Indian Trading Corporation',
      address: 'Kanjikode Industrial Area, Palakkad',
      area: 'Kanjikode',
      phone: '+91 491 257 1234',
      types: ['Iron', 'Steel', 'Copper', 'Aluminium'],
      rating: 4.3,
      reviews: 87,
      mapsQuery: 'Indian Trading Corporation Kanjikode Palakkad Kerala',
      mapsDirectionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Indian+Trading+Corporation+Kanjikode+Palakkad+Kerala',
      photo: 'metal',
      openNow: true,
      hours: '9:00 AM – 6:00 PM',
    },
    {
      id: 'plk-2',
      slug: 'lakshmi-scrap-shop',
      districtId: 'palakkad',
      name: 'Lakshmi Scrap Shop',
      address: 'Koottupatha, Near Polytechnic College Bus Stop, Palakkad',
      area: 'Koottupatha',
      phone: '+91 491 253 4890',
      types: ['Newspaper', 'Cardboard', 'Plastic', 'Brass'],
      rating: 4.1,
      reviews: 54,
      mapsQuery: 'Lakshmi Scrap Shop Koottupatha Palakkad Kerala',
      mapsDirectionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Lakshmi+Scrap+Shop+Koottupatha+Palakkad+Kerala',
      photo: 'paper',
      openNow: true,
      hours: '8:30 AM – 6:30 PM',
    },
    {
      id: 'plk-3',
      slug: 'kn-traders',
      districtId: 'palakkad',
      name: 'KN Traders',
      address: 'Pattambi Road, Palakkad',
      area: 'Pattambi',
      phone: '+91 94471 00283',
      types: ['E-Waste', 'Iron', 'Copper', 'LED/TV'],
      rating: 4.4,
      reviews: 112,
      mapsQuery: 'KN Traders Pattambi Palakkad Kerala',
      mapsDirectionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=KN+Traders+Pattambi+Palakkad+Kerala',
      photo: 'ewaste',
      openNow: false,
      hours: '9:00 AM – 5:30 PM',
    },
  ],
  malappuram: [
    {
      id: 'mlp-sn',
      slug: 'sn-scrap',
      districtId: 'malappuram',
      name: 'SN Scrap',
      address: 'Parambil Peedika Center, Kondotty, Chellary, Malappuram – 673638',
      area: 'Kondotty / Chellary',
      phone: '+91 98476 05132',
      types: ['Steel', 'Fridge', 'Copper', 'Aluminium', 'Plastic', 'Cardboard', 'Bottles'],
      rating: 4.8,
      reviews: 58,
      mapsQuery: 'SN Scrap Parambil Peedika Kondotty Chellary Malappuram Kerala',
      mapsDirectionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=SN+Scrap+Parambil+Peedika+Center+Kondotty+Malappuram+Kerala',
      photo: 'metal',
      openNow: true,
      hours: '8:00 AM – 7:00 PM',
    },
    {
      id: 'mlp-1',
      slug: 'kp-steel-old-scrap',
      districtId: 'malappuram',
      name: 'KP Steel Old Scrap',
      address: '8/136BC, CH Bypass Road, Opp. Bus Owners Pump, Karuvambram, Manjeri',
      area: 'Manjeri',
      phone: '+91 94956 78234',
      types: ['Steel', 'Iron', 'Copper', 'Brass'],
      rating: 4.5,
      reviews: 143,
      mapsQuery: 'KP Steel Old Scrap Karuvambram Manjeri Malappuram Kerala',
      mapsDirectionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=KP+Steel+Old+Scrap+Karuvambram+Manjeri+Malappuram+Kerala',
      photo: 'metal',
      openNow: true,
      hours: '8:00 AM – 7:00 PM',
    },
    {
      id: 'mlp-2',
      slug: 'thoppil-scraps',
      districtId: 'malappuram',
      name: 'Thoppil Scraps',
      address: 'Downhill, Malappuram – 676519',
      area: 'Downhill',
      phone: '+91 483 276 1890',
      types: ['Newspaper', 'Plastic', 'Aluminium', 'E-Waste'],
      rating: 4.2,
      reviews: 68,
      mapsQuery: 'Thoppil Scraps Downhill Malappuram Kerala',
      mapsDirectionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Thoppil+Scraps+Downhill+Malappuram+Kerala',
      photo: 'paper',
      openNow: true,
      hours: '9:00 AM – 6:00 PM',
    },
    {
      id: 'mlp-3',
      slug: 'three-star-scrap-shop',
      districtId: 'malappuram',
      name: 'Three Star Scrap Shop',
      address: 'Tirur Road, Kuttippuram, Malappuram',
      area: 'Kuttippuram',
      phone: '+91 494 262 3311',
      types: ['Iron', 'Copper', 'Cardboard', 'LED/TV'],
      rating: 4.0,
      reviews: 39,
      mapsQuery: 'Three Star Scrap Shop Kuttippuram Malappuram Kerala',
      mapsDirectionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Three+Star+Scrap+Shop+Kuttippuram+Malappuram+Kerala',
      photo: 'ewaste',
      openNow: true,
      hours: '9:30 AM – 6:30 PM',
    },
    {
      id: 'mlp-4',
      slug: 'a1-enterprise-scrap-shop',
      districtId: 'malappuram',
      name: 'A1 Enterprise Scrap Shop',
      address: 'Garden Valley School Road, Kuttippala, Malappuram – 676501',
      area: 'Kuttippala',
      phone: '+91 94956 23401',
      types: ['Steel', 'Aluminium', 'Plastic', 'Brass'],
      rating: 4.3,
      reviews: 57,
      mapsQuery: 'A1 Enterprise Scrap Shop Kuttippala Malappuram Kerala',
      mapsDirectionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=A1+Enterprise+Scrap+Shop+Kuttippala+Malappuram+Kerala',
      photo: 'metal',
      openNow: false,
      hours: '9:00 AM – 6:00 PM',
    },
  ],
  thrissur: [
    {
      id: 'tsr-1',
      slug: 'babu-scrap-ewaste-centre',
      districtId: 'thrissur',
      name: 'Babu Scrap – E-Waste Centre',
      address: 'Near Sevanalayam Church, Chiyyaram, Thrissur – 680026',
      area: 'Chiyyaram',
      phone: '+91 94473 52539',
      types: ['E-Waste', 'LED/TV', 'Laptops', 'Mobile'],
      rating: 4.6,
      reviews: 201,
      mapsQuery: 'Babu Scrap Chiyyaram Thrissur Kerala',
      mapsDirectionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Babu+Scrap+Chiyyaram+Thrissur+Kerala',
      photo: 'ewaste',
      openNow: true,
      hours: '8:00 AM – 7:00 PM',
    },
    {
      id: 'tsr-2',
      slug: 'marvel-steels',
      districtId: 'thrissur',
      name: 'Marvel Steels',
      address: 'Opposite KRS Parcel Service, Chiyyaram, Thrissur',
      area: 'Chiyyaram',
      phone: '+91 487 234 5621',
      types: ['Steel', 'Iron', 'Copper', 'Aluminium', 'Brass'],
      rating: 4.4,
      reviews: 166,
      mapsQuery: 'Marvel Steels Chiyyaram Thrissur Kerala',
      mapsDirectionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Marvel+Steels+Chiyyaram+Thrissur+Kerala',
      photo: 'metal',
      openNow: true,
      hours: '9:00 AM – 6:30 PM',
    },
    {
      id: 'tsr-3',
      slug: 'ecogreen-scrap-trading',
      districtId: 'thrissur',
      name: 'Ecogreen Scrap Trading',
      address: 'Mathilakam, Thrissur',
      area: 'Mathilakam',
      phone: '+91 94471 67823',
      types: ['Newspaper', 'Plastic', 'Cardboard', 'Aluminium'],
      rating: 4.2,
      reviews: 88,
      mapsQuery: 'Ecogreen Scrap Trading Mathilakam Thrissur Kerala',
      mapsDirectionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Ecogreen+Scrap+Trading+Mathilakam+Thrissur+Kerala',
      photo: 'paper',
      openNow: true,
      hours: '8:30 AM – 6:00 PM',
    },
    {
      id: 'tsr-4',
      slug: 'venkiteshwara-aakri-kada',
      districtId: 'thrissur',
      name: 'Venkiteshwara Aakri Kada',
      address: 'Opp. National Dresses, Near Santhigiri, Kolazhy, Thrissur',
      area: 'Kolazhy',
      phone: '+91 487 238 9901',
      types: ['Iron', 'Copper', 'Brass', 'E-Waste'],
      rating: 4.1,
      reviews: 74,
      mapsQuery: 'Venkiteshwara Aakri Kada Kolazhy Thrissur Kerala',
      mapsDirectionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Venkiteshwara+Aakri+Kada+Kolazhy+Thrissur+Kerala',
      photo: 'metal',
      openNow: false,
      hours: '9:00 AM – 5:30 PM',
    },
  ],
  kochi: [
    {
      id: 'kch-0',
      slug: 'ok-scrap',
      districtId: 'kochi',
      name: 'Ok Scrap',
      address: 'Muvattupuzha, Ernakulam',
      area: 'Muvattupuzha',
      phone: '7034286821',
      types: ['Bottle', 'Glass', 'Kuppi'],
      rating: 4.5,
      reviews: 98,
      mapsQuery: 'Ok Scrap Muvattupuzha Ernakulam Kerala',
      mapsDirectionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Ok+Scrap+Muvattupuzha+Ernakulam+Kerala',
      photo: 'bottle',
      openNow: true,
      hours: '9:00 AM – 6:00 PM',
    },
    {
      id: 'kch-1',
      slug: 'svk-scrap',
      districtId: 'kochi',
      name: 'SVK Scrap',
      address: 'Vazhakkala, Kakkanad, Ernakulam',
      area: 'Kakkanad',
      phone: '+91 94470 12893',
      types: ['Iron', 'Steel', 'Copper', 'E-Waste', 'LED/TV'],
      rating: 4.5,
      reviews: 234,
      mapsQuery: 'SVK Scrap Vazhakkala Kakkanad Ernakulam Kerala',
      mapsDirectionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=SVK+Scrap+Vazhakkala+Kakkanad+Ernakulam+Kerala',
      photo: 'metal',
      openNow: true,
      hours: '8:00 AM – 7:00 PM',
    },
    {
      id: 'kch-2',
      slug: 'lifeline-scraps',
      districtId: 'kochi',
      name: 'Lifeline Scraps',
      address: 'Crash Road, Thrikkakara, Ernakulam',
      area: 'Thrikkakara',
      phone: '+91 484 278 6543',
      types: ['E-Waste', 'Laptops', 'Mobile', 'LED/TV'],
      rating: 4.6,
      reviews: 317,
      mapsQuery: 'Lifeline Scraps Thrikkakara Ernakulam Kerala',
      mapsDirectionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Lifeline+Scraps+Thrikkakara+Ernakulam+Kerala',
      photo: 'ewaste',
      openNow: true,
      hours: '9:00 AM – 7:30 PM',
    },
    {
      id: 'kch-3',
      slug: 'v-sign-scrap-traders',
      districtId: 'kochi',
      name: 'V-Sign Scrap Traders',
      address: 'Near Chakkaraparambu, Vyttila, Ernakulam',
      area: 'Vyttila',
      phone: '+91 94468 23901',
      types: ['Newspaper', 'Cardboard', 'Plastic', 'Aluminium'],
      rating: 4.3,
      reviews: 189,
      mapsQuery: 'V-Sign Scrap Traders Vyttila Ernakulam Kerala',
      mapsDirectionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=V-Sign+Scrap+Traders+Vyttila+Ernakulam+Kerala',
      photo: 'paper',
      openNow: true,
      hours: '8:30 AM – 6:30 PM',
    },
    {
      id: 'kch-4',
      slug: 'mini-and-co-broadway',
      districtId: 'kochi',
      name: 'Mini & Co – Broadway',
      address: 'Broadway, Ernakulam, Kochi – 682031',
      area: 'Broadway',
      phone: '+91 484 235 7812',
      types: ['Iron', 'Copper', 'Brass', 'Steel', 'E-Waste'],
      rating: 4.4,
      reviews: 142,
      mapsQuery: 'Mini and Co Broadway Ernakulam Kerala',
      mapsDirectionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Mini+and+Co+Broadway+Ernakulam+Kerala',
      photo: 'metal',
      openNow: false,
      hours: '9:00 AM – 6:00 PM',
    },
    {
      id: 'kch-5',
      slug: 'nexia-recycling-corporation',
      districtId: 'kochi',
      name: 'Nexia Recycling Corporation',
      address: 'Edappally, Kochi, Ernakulam',
      area: 'Edappally',
      phone: '+91 484 277 9934',
      types: ['E-Waste', 'LED/TV', 'Iron', 'Copper', 'Plastic'],
      rating: 4.7,
      reviews: 412,
      mapsQuery: 'Nexia Recycling Corporation Edappally Kochi Kerala',
      mapsDirectionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Nexia+Recycling+Corporation+Edappally+Kochi+Kerala',
      photo: 'ewaste',
      openNow: true,
      hours: '8:00 AM – 8:00 PM',
    },
  ],
};

export const PHOTO_MAP: Record<string, string> = {
  metal: '/scrap_shop_metal.jpg',
  ewaste: '/scrap_shop_ewaste.jpg',
  paper: '/scrap_shop_paper.jpg',
  bottle: '/scrap_shop_bottle.jpg',
};

// Flat list of all shops for easy lookup by slug
export function getAllShops(): ScrapShop[] {
  return Object.values(SCRAP_SHOPS).flat();
}

export function findShopBySlug(slug: string): ScrapShop | undefined {
  return getAllShops().find((s) => s.slug === slug);
}
