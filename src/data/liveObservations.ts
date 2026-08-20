import { SightingObservation } from '../types';

export const INITIAL_OBSERVATIONS: SightingObservation[] = [
  {
    id: 'obs-101',
    speciesId: 'peregrine-falcon',
    commonName: 'Peregrine Falcon',
    scientificName: 'Falco peregrinus',
    observerName: 'Dr. Sarah Lin',
    locationName: 'Hawk Mountain Sanctuary, PA',
    latitude: 40.632,
    longitude: -75.986,
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    count: 2,
    habitat: 'Mountain Ridge / Forest Lookout',
    weather: 'Clear, 18°C, Wind NW 12kt',
    notes: 'Adult soaring on thermals along Atlantic Flyway, executed high speed stoop after European Starlings.',
    rarity: 'Uncommon',
    verified: true,
    flyway: 'Atlantic Flyway',
    imageUrl: 'https://images.unsplash.com/photo-1574063413132-355dbfd83e08?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'obs-102',
    speciesId: 'snowy-owl',
    commonName: 'Snowy Owl',
    scientificName: 'Bubo scandiacus',
    observerName: 'Marcus Vance (Field Biologist)',
    locationName: 'Plum Island Wildlife Refuge, MA',
    latitude: 42.784,
    longitude: -70.812,
    timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    count: 1,
    habitat: 'Coastal Dune Grasslands',
    weather: 'Partly Cloudy, 4°C, Wind E 15kt',
    notes: 'Female with dark barring perched atop dune crest monitoring salt marsh edge. Exceptional irruptive sighting!',
    rarity: 'Rare',
    verified: true,
    flyway: 'Atlantic Flyway',
    imageUrl: ''
  },
  {
    id: 'obs-103',
    speciesId: 'cardinal',
    commonName: 'Northern Cardinal',
    scientificName: 'Cardinalis cardinalis',
    observerName: 'Elena Rostova',
    locationName: 'Forest Park Botanic Garden, St. Louis, MO',
    latitude: 38.638,
    longitude: -90.284,
    timestamp: new Date(Date.now() - 1000 * 60 * 32).toISOString(),
    count: 6,
    habitat: 'Wooded Shrubland & Garden Feeders',
    weather: 'Sunny, 22°C',
    notes: 'Active courtship feeding behavior observed between male and female near dogwood thicket.',
    rarity: 'Common',
    verified: true,
    flyway: 'Mississippi Flyway',
    imageUrl: 'https://images.unsplash.com/photo-1549608276-5786777e6587?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'obs-104',
    speciesId: 'bald-eagle',
    commonName: 'Bald Eagle',
    scientificName: 'Haliaeetus leucocephalus',
    observerName: 'Capt. James Miller',
    locationName: 'Skagit River Bald Eagle Reserve, WA',
    latitude: 48.528,
    longitude: -121.724,
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    count: 14,
    habitat: 'Riparian River Basin',
    weather: 'Overcast & Misty, 11°C',
    notes: 'Kettle of 14 eagles gathered near gravel bar feeding on spawning salmon run.',
    rarity: 'Common',
    verified: true,
    flyway: 'Pacific Flyway',
    imageUrl: 'https://images.unsplash.com/photo-1611095973763-414019e72400?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'obs-105',
    speciesId: 'great-blue-heron',
    commonName: 'Great Blue Heron',
    scientificName: 'Ardea herodias',
    observerName: 'Dr. Evelyn Vance',
    locationName: 'Everglades National Park, FL',
    latitude: 25.286,
    longitude: -80.898,
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    count: 4,
    habitat: 'Freshwater Slough & Cypress Dome',
    weather: 'Warm, 28°C, Humid',
    notes: 'Slow stalking technique witnessed. One adult speared a 10-inch catfish successfully.',
    rarity: 'Common',
    verified: true,
    flyway: 'Atlantic Flyway',
    imageUrl: 'https://images.unsplash.com/photo-1550853024-fae8cd4be47f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'obs-106',
    speciesId: 'ruby-throated-hummingbird',
    commonName: 'Ruby-throated Hummingbird',
    scientificName: 'Archilochus colubris',
    observerName: 'Chloe Bennett',
    locationName: 'Congaree National Park, SC',
    latitude: 33.784,
    longitude: -80.781,
    timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    count: 3,
    habitat: 'Bottomland Hardwood Forest',
    weather: 'Sunny, 26°C',
    notes: 'Feeding on jewelweed nectar before south flight migration stretch.',
    rarity: 'Common',
    verified: true,
    flyway: 'Atlantic Flyway',
    imageUrl: 'https://images.unsplash.com/photo-1520808663317-647b476a81b9?auto=format&fit=crop&w=800&q=80'
  }
];

// Helper to synthesize a random new live field observation
export function generateRandomSighting(): SightingObservation {
  const sampleLocations = [
    { name: 'Klamath Basin National Wildlife Refuge, OR', lat: 41.983, lng: -121.782, flyway: 'Pacific Flyway' },
    { name: 'Cape May Bird Observatory, NJ', lat: 38.935, lng: -74.906, flyway: 'Atlantic Flyway' },
    { name: 'High Island Sanctuary, TX', lat: 29.568, lng: -94.385, flyway: 'Mississippi Flyway' },
    { name: 'Point Pelee National Park, ON', lat: 41.962, lng: -82.518, flyway: 'Mississippi Flyway' },
    { name: 'Bosque del Apache NWR, NM', lat: 33.791, lng: -106.884, flyway: 'Central Flyway' },
    { name: 'Saguaro National Park, AZ', lat: 32.25, lng: -110.738, flyway: 'Pacific Flyway' }
  ];

  const sampleObservers = [
    'Dr. Aris Thorne', 'Maya Lin (Birder)', 'Devon Reed', 'Prof. Silas Vance',
    'Samira Khan', 'Liam O’Connor', 'Hannah Wright (Audubon Guide)'
  ];

  const speciesList = [
    { id: 'cardinal', name: 'Northern Cardinal', sci: 'Cardinalis cardinalis', rarity: 'Common' as const, img: 'https://images.unsplash.com/photo-1549608276-5786777e6587?auto=format&fit=crop&w=800&q=80' },
    { id: 'peregrine-falcon', name: 'Peregrine Falcon', sci: 'Falco peregrinus', rarity: 'Uncommon' as const, img: 'https://images.unsplash.com/photo-1574063413132-355dbfd83e08?auto=format&fit=crop&w=800&q=80' },
    { id: 'bald-eagle', name: 'Bald Eagle', sci: 'Haliaeetus leucocephalus', rarity: 'Common' as const, img: 'https://images.unsplash.com/photo-1611095973763-414019e72400?auto=format&fit=crop&w=800&q=80' },
    { id: 'barn-owl', name: 'Barn Owl', sci: 'Tyto alba', rarity: 'Uncommon' as const, img: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80' },
    { id: 'snowy-owl', name: 'Snowy Owl', sci: 'Bubo scandiacus', rarity: 'Rare' as const, img: 'https://images.unsplash.com/photo-1568819317551-31051b37f69f?auto=format&fit=crop&w=800&q=80' },
    { id: 'american-goldfinch', name: 'American Goldfinch', sci: 'Spinus tristis', rarity: 'Common' as const, img: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=800&q=80' }
  ];

  const loc = sampleLocations[Math.floor(Math.random() * sampleLocations.length)];
  const sp = speciesList[Math.floor(Math.random() * speciesList.length)];
  const obs = sampleObservers[Math.floor(Math.random() * sampleObservers.length)];

  return {
    id: `obs-gen-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    speciesId: sp.id,
    commonName: sp.name,
    scientificName: sp.sci,
    observerName: obs,
    locationName: loc.name,
    latitude: loc.lat + (Math.random() - 0.5) * 0.1,
    longitude: loc.lng + (Math.random() - 0.5) * 0.1,
    timestamp: new Date().toISOString(),
    count: Math.floor(Math.random() * 5) + 1,
    habitat: 'Field / Wetland Transition',
    weather: 'Clear, 20°C, Calm',
    notes: 'Verified field observation log registered via real-time telemetry.',
    rarity: sp.rarity,
    verified: true,
    flyway: loc.flyway,
    imageUrl: sp.img
  };
}
