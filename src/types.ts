export type ConservationStatus = 'LC' | 'NT' | 'VU' | 'EN' | 'CR' | 'EW' | 'EX';

export interface BirdSpecies {
  id: string;
  commonName: string;
  scientificName: string;
  order: string;
  family: string;
  genus: string;
  conservationStatus: ConservationStatus;
  statusLabel: string;
  wingspanCm: number;
  lengthCm: number;
  weightG: number;
  habitat: string[];
  diet: string[];
  region: string[];
  flyway: string;
  imageUrl: string;
  audioFrequencyHz?: number; // Base frequency for synthetic call synthesis
  callPattern?: 'trill' | 'chirp-repeat' | 'hoot-rhythm' | 'whistle-slide' | 'rapid-peck';
  callDescription: string;
  keyFieldMarks: string[];
  description: string;
  nesting: string;
  migrationStatus: 'Resident' | 'Neotropical Migrant' | 'Short-Distance Migrant' | 'Nomadic' | 'Irruptive';
  similarSpeciesIds: string[];
  funFact: string;
  rarityLevel: 'Common' | 'Uncommon' | 'Rare' | 'Vagrant';
}

export interface SightingObservation {
  id: string;
  speciesId: string;
  commonName: string;
  scientificName: string;
  observerName: string;
  locationName: string;
  latitude: number;
  longitude: number;
  timestamp: string; // ISO string
  count: number;
  habitat: string;
  weather: string;
  notes: string;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Vagrant';
  verified: boolean;
  imageUrl?: string;
  flyway: string;
}

export interface QuizQuestion {
  id: string;
  type: 'visual' | 'audio' | 'fieldmark' | 'anatomy' | 'trivia';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  speciesId?: string;
  imageUrl?: string;
  audioFrequencyHz?: number;
  audioPattern?: 'trill' | 'chirp-repeat' | 'hoot-rhythm' | 'whistle-slide' | 'rapid-peck';
  fieldMarkHint?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Expert';
}

export interface QuizSet {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Expert';
  questions: QuizQuestion[];
}

export interface LifeListEntry {
  id: string;
  speciesId: string;
  commonName: string;
  scientificName: string;
  date: string;
  location: string;
  coordinates?: { lat: number; lng: number };
  notes: string;
  photoUrl?: string;
  behaviorTags: string[];
}

export interface AIIdentificationResult {
  primaryMatch: {
    commonName: string;
    scientificName: string;
    family: string;
    order: string;
    confidence: 'High' | 'Medium' | 'Low';
    confidencePercentage: number;
    summary: string;
    keyFieldMarks: string[];
    habitat: string;
    diet: string;
    behavior: string;
    callDescription: string;
    funFact: string;
  };
  similarSpecies: {
    commonName: string;
    scientificName: string;
    distinguishingFeature: string;
  }[];
  expertFieldTips: string[];
}
