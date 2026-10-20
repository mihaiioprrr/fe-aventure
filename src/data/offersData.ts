import { TravelOffer } from '../types';

export const TRAVEL_OFFERS: TravelOffer[] = [
  {
    id: 'aventura-carpatilor',
    title: 'Canionul 7 Scări & Masivul Piatra Mare',
    subtitle: 'Drumeție montană, tiroliene și aer curat în Carpați',
    category: 'Aventură Montană',
    destination: 'Brașov, România',
    country: 'România',
    durationDays: 3,
    durationNights: 2,
    priceRon: 490,
    originalPriceRon: 580,
    rating: 4.9,
    reviewCount: 38,
    transportType: 'Autocar turistic',
    accommodationType: 'Pensiune 3*',
    difficulty: 'Activ / Aventură',
    featured: true,
    shortDescription: 'Trekking prin canionul stâncos, 23 de tiroliene și foc de tabără la poalele muntelui.',
    fullDescription: 'O evadare activă în natură gândită special pentru elevi. Traseul include urcarea prin Canionul 7 Scări pe pasarele metalice securizate, coborâre pe tiroliene și o după-amiază relaxantă în centrul vechi al Brașovului.',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [],
    highlights: [
      'Traseul de tiroliene Canionul 7 Scări inclus',
      'Ghid montan atestat pe tot parcursul',
      'Seară la foc de tabără',
      'Timp liber în Piața Sfatului din Brașov'
    ],
    includedServices: [
      'Transport cu autocar clasificat',
      '2 nopți cazare la pensiune 3*',
      'Demipensiune (mic dejun și cină)',
      'Echipament complet de protecție'
    ],
    notIncludedServices: [
      'Mesele de prânz',
      'Cheltuieli personale'
    ],
    itinerary: [
      { day: 1, title: 'Sosire & Acomodare', description: 'Plecarea dimineața, cazare la pensiune și plimbare ușoară în zonă.' },
      { day: 2, title: 'Canionul 7 Scări & Tiroliene', description: 'Traseul prin canion, experiența tirolienelor și foc de tabără seara.' },
      { day: 3, title: 'Brașov & Întoarcere', description: 'Vizită în centrul Brașovului și plecare spre casă.' }
    ],
    nextDepartures: ['Octombrie 2026', 'Noiembrie 2026'],
    spotsRemaining: 8
  },
  {
    id: 'delta-dunarii',
    title: 'Delta Dunării & Pădurea Letea',
    subtitle: 'Natură sălbatică, plimbări cu barca și safari la dune',
    category: 'Eco-Turism',
    destination: 'Tulcea & Letea',
    country: 'România',
    durationDays: 4,
    durationNights: 3,
    priceRon: 780,
    originalPriceRon: 890,
    rating: 5.0,
    reviewCount: 42,
    transportType: 'Autocar + Barcă rapidă',
    accommodationType: 'Pensiune 4*',
    difficulty: 'Ușor',
    featured: true,
    shortDescription: 'Plimbări cu barca pe canale cu nuferi, cai sălbatici la Letea și prânz tradițional pescăresc.',
    fullDescription: 'Explorează Delta Dunării într-un ritm relaxat: excursii cu bărcile pe canale înguste, safari cu mașini de teren în Rezervația Letea și apusuri de neuitat pe malul apei.',
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [],
    highlights: [
      'Excursie cu barca pe canalele cu nuferi',
      'Safari în Pădurea subtropicală Letea',
      'Prânz pescăresc tradițional inclus',
      'Plajă și apus la Sulina'
    ],
    includedServices: [
      'Transport autocar + transfer barcă rapidă',
      '3 nopți cazare la pensiune 4*',
      'Pensiune completă',
      'Permise de acces în rezervație'
    ],
    notIncludedServices: [
      'Cheltuieli personale'
    ],
    itinerary: [
      { day: 1, title: 'Sosire în Deltă', description: 'Transfer cu barca spre cazare și cină de bun venit.' },
      { day: 2, title: 'Safari la Letea', description: 'Excursie în pădurea cu dune de nisip și cai sălbatici.' },
      { day: 3, title: 'Canale & Sulina', description: 'Plimbare pe canale, colonii de pelicani și plaja Sulina.' },
      { day: 4, title: 'Întoarcere', description: 'Mic dejun și transfer spre autocar.' }
    ],
    nextDepartures: ['Noiembrie 2026', 'Aprilie 2027'],
    spotsRemaining: 12
  },
  {
    id: 'city-break-viena',
    title: 'City Break Cultural: Viena',
    subtitle: 'Palatul Schönbrunn, muzee interactive și parcul Prater',
    category: 'City Break & Cultură',
    destination: 'Viena, Austria',
    country: 'Austria',
    durationDays: 4,
    durationNights: 3,
    priceRon: 1190,
    originalPriceRon: 1350,
    rating: 4.8,
    reviewCount: 51,
    transportType: 'Autocar internațional VIP',
    accommodationType: 'Hotel 4*',
    difficulty: 'Ușor',
    featured: true,
    shortDescription: 'Turul capitalului Austriei: palate imperiale, muzee de știință și distracție în Prater.',
    fullDescription: 'O călătorie culturală accesibilă pentru liceeni, combinând vizitele istorice cu timpul liber pentru explorare urbană și relaxare în Viena.',
    imageUrl: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [],
    highlights: [
      'Vizită la Palatul Schönbrunn și grădinile imperiale',
      'Tur pietonal în centrul istoric al Vienei',
      'Muzeul Tehnic interactiv',
      'Timp liber în parcul de distracții Prater'
    ],
    includedServices: [
      'Transport autocar internațional',
      '3 nopți cazare la hotel 4* cu mic dejun',
      'Ghid turistic însoțitor',
      'Abonament transport local'
    ],
    notIncludedServices: [
      'Prânz și cină',
      'Intrări opționale în parcul Prater'
    ],
    itinerary: [
      { day: 1, title: 'Plecarea spre Austria', description: 'Sosire seara în Viena și check-in la hotel.' },
      { day: 2, title: 'Schönbrunn & Centru', description: 'Turul palatului și plimbare prin centrul vechi.' },
      { day: 3, title: 'Muzee & Prater', description: 'Muzeul de Știință și după-amiază în Prater.' },
      { day: 4, title: 'Întoarcere', description: 'Plecare spre casă dimineața.' }
    ],
    nextDepartures: ['Decembrie 2026', 'Februarie 2027'],
    spotsRemaining: 6
  },
  {
    id: 'circuit-transilvania',
    title: 'Cetățile Medievale din Transilvania',
    subtitle: 'Sighișoara, Sibiu și legendele Castelului Bran',
    category: 'Circuite Școlare',
    destination: 'Sighișoara - Sibiu - Bran',
    country: 'România',
    durationDays: 3,
    durationNights: 2,
    priceRon: 430,
    originalPriceRon: 510,
    rating: 4.9,
    reviewCount: 65,
    transportType: 'Autocar clasificat',
    accommodationType: 'Hotel 3*',
    difficulty: 'Ușor',
    featured: false,
    shortDescription: 'O excursie clasică de liceu prin cele mai frumoase orașe medievale din România.',
    fullDescription: 'Descoperă Turnul cu Ceas din Sighișoara, Podul Minciunilor din Sibiu și atmosfera legendară de la Castelul Bran într-un circuit de 3 zile.',
    imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [],
    highlights: [
      'Tur pietonal în cetatea Sighișoara',
      'Vizitarea Castelului Bran',
      'Centrul vechi din Sibiu',
      'Gratuitate 1 profesor la 10 elevi'
    ],
    includedServices: [
      'Transport autocar turistic',
      '2 nopți cazare la hotel 3*',
      'Demipensiune inclusă',
      'Bilete de intrare la obiective'
    ],
    notIncludedServices: [
      'Cheltuieli personale'
    ],
    itinerary: [
      { day: 1, title: 'Sibiu', description: 'Sosire în Sibiu, tur pietonal și cazare.' },
      { day: 2, title: 'Sighișoara', description: 'Vizitarea cetății medievale și timp liber.' },
      { day: 3, title: 'Bran & Întoarcere', description: 'Castelul Bran și drumul spre casă.' }
    ],
    nextDepartures: ['Noiembrie 2026', 'Martie 2027'],
    spotsRemaining: 15
  },
  {
    id: 'litoral-grecia',
    title: 'Riviera Olimpului & Insula Skiathos',
    subtitle: 'Plaje fine, ape turcoaz și croazieră mediteraneană',
    category: 'Litoral & Relaxare',
    destination: 'Riviera Olimpului, Grecia',
    country: 'Grecia',
    durationDays: 7,
    durationNights: 6,
    priceRon: 1450,
    originalPriceRon: 1690,
    rating: 4.9,
    reviewCount: 78,
    transportType: 'Autocar internațional',
    accommodationType: 'Hotel 3* aproape de plajă',
    difficulty: 'Ușor',
    featured: false,
    shortDescription: 'Sejur de relaxare pe litoralul Greciei cu croazieră pe insula Skiathos inclusă.',
    fullDescription: 'Vacanța perfectă de vară pentru liceeni: soare, mare caldă, volei pe plajă și o zi pe vasul de croazieră spre Skiathos.',
    imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [],
    highlights: [
      'Croazieră de o zi pe insula Skiathos',
      'Cazare la 100 m de plajă',
      'Seară tradițională grecească',
      'Excursie la poalele Muntelui Olimp'
    ],
    includedServices: [
      'Transport autocar internațional',
      '6 nopți cazare hotel 3*',
      'Demipensiune (mic dejun + cină)',
      'Însoțitor de grup'
    ],
    notIncludedServices: [
      'Taxă locală de stațiune (1.5 €/noapte)',
      'Cheltuieli personale'
    ],
    itinerary: [
      { day: 1, title: 'Drumul spre Grecia', description: 'Plecare după-amiaza din România.' },
      { day: 2, title: 'Sosire & Plajă', description: 'Cazare și timp de relaxare pe plajă.' },
      { day: 3, title: 'Croazieră Skiathos', description: 'O zi completă pe mare și plaja Koukounaries.' },
      { day: 4, title: 'Relaxare & Muntele Olimp', description: 'Excursie la Litochoro și timp liber.' },
      { day: 5, title: 'Plajă & Sporturi nautice', description: 'Activități pe plajă și relaxare.' },
      { day: 6, title: 'Seară grecească', description: 'Cină tradițională cu muzică.' },
      { day: 7, title: 'Întoarcere', description: 'Plecare spre România.' }
    ],
    nextDepartures: ['Iunie 2027', 'Iulie 2027'],
    spotsRemaining: 10
  }
];

export const COMPANY_INFO = {
  name: 'F.E. Aventure S.R.L.',
  tagline: 'Agenție de Turism · Firmă de Exercițiu',
  email: 'contact@fe-aventure.ro',
  phone: '+40 721 890 123',
  location: 'Liceu / Colegiu Economic',
  schedule: 'Luni - Vineri: 09:00 - 15:00',
};
