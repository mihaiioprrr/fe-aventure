export interface DayItinerary {
  day: number;
  title: string;
  description: string;
}

export type OfferCategory =
  | 'Aventură Montană'
  | 'City Break & Cultură'
  | 'Litoral & Relaxare'
  | 'Circuite Școlare'
  | 'Eco-Turism';

export interface TravelOffer {
  id: string;
  title: string;
  subtitle: string;
  category: OfferCategory;
  destination: string;
  country: string;
  durationDays: number;
  durationNights: number;
  priceRon: number;
  originalPriceRon?: number;
  rating: number;
  reviewCount: number;
  transportType: string;
  accommodationType: string;
  difficulty: 'Ușor' | 'Moderat' | 'Activ / Aventură';
  featured?: boolean;
  shortDescription: string;
  fullDescription: string;
  imageUrl: string;
  galleryImages: string[];
  highlights: string[];
  includedServices: string[];
  notIncludedServices: string[];
  itinerary: DayItinerary[];
  nextDepartures: string[];
  spotsRemaining: number;
}

export interface ContactFormData {
  fullName: string;
  email: string;
  phone: string;
  schoolOrEntity: string;
  offerId: string;
  travelDate: string;
  numberOfPeople: number;
  travelerType: 'Elev / Licean' | 'Cadru Didactic / Grup Școlar' | 'Tânăr / Student' | 'Altul';
  message: string;
}

export interface Testimonial {
  id: string;
  author: string;
  role: string;
  comment: string;
  avatar: string;
  offerTitle: string;
  rating: number;
}
