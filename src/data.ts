import { PhotoItem, VideoItem } from './types';

import dscf3275 from '../assets/photos/DSCF3275.jpg';
import dscf3307 from '../assets/photos/DSCF3307.jpg';
import dscf3343 from '../assets/photos/DSCF3343.jpg';
import dscf3368 from '../assets/photos/DSCF3368.jpg';
import dscf3389 from '../assets/photos/DSCF3389.jpg';

export const PHOTO_ITEMS: PhotoItem[] = [
  {
    id: 'user-photo-1',
    title: 'Silent Resonance',
    category: 'Architecture',
    imageUrl: dscf3275,
    description: 'A study of brutalist concrete forms intersecting with organic, soft morning shadows in Copenhagen.',
    location: 'Copenhagen, Denmark',
    date: 'May 2026',
    camera: 'Fujifilm GFX 100S',
    lens: 'GF 32-64mm f/4 R LM WR',
    aperture: 'f/8.0',
    shutterSpeed: '1/125s',
    iso: '100'
  },
  {
    id: 'user-photo-2',
    title: 'Nordic Contemplation',
    category: 'Portrait',
    imageUrl: dscf3307,
    description: 'Fine art portrait study exploring high-contrast morning light filtering through high studio glass panes.',
    location: 'Aarhus, Denmark',
    date: 'May 2026',
    camera: 'Fujifilm X-T5',
    lens: 'XF 56mm f/1.2 R WR',
    aperture: 'f/1.2',
    shutterSpeed: '1/800s',
    iso: '125'
  },
  {
    id: 'user-photo-3',
    title: 'Symmetrical Intersection',
    category: 'Architecture',
    imageUrl: dscf3343,
    description: 'Hard geometries and interlocking concrete angles of Danish structuralism, captured under raw direct sunlight.',
    location: 'Ørestad, Denmark',
    date: 'June 2026',
    camera: 'Fujifilm GFX 100S',
    lens: 'GF 23mm f/4 R LM WR',
    aperture: 'f/5.6',
    shutterSpeed: '1/250s',
    iso: '100'
  },
  {
    id: 'user-photo-4',
    title: 'Skagen Shoreline Mists',
    category: 'Landscape',
    imageUrl: dscf3368,
    description: "Low-contrast panoramic view of Denmark's northernmost beach, capturing the soft meeting point of Baltic and North sea tides.",
    location: 'Skagen, Denmark',
    date: 'June 2026',
    camera: 'Fujifilm GFX 100S',
    lens: 'GF 45-100mm f/4 R LM WR',
    aperture: 'f/11.0',
    shutterSpeed: '1/15s',
    iso: '100'
  },
  {
    id: 'user-photo-5',
    title: 'The Solitary Crosswalk',
    category: 'Street',
    imageUrl: dscf3389,
    description: 'High shadow fall-off and striking linear shapes of a lonely pedestrian walking in an empty Copenhagen district.',
    location: 'Copenhagen, Denmark',
    date: 'June 2026',
    camera: 'Fujifilm X-T5',
    lens: 'XF 33mm f/1.4 R LM WR',
    aperture: 'f/2.0',
    shutterSpeed: '1/500s',
    iso: '400'
  },
  {
    id: 'photo-1',
    title: 'Symmetry in Concrete',
    category: 'Architecture',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200',
    description: 'A study of brutalist concrete forms intersecting with the soft, warm golden light of late afternoon, showcasing lines, shadows, and architectural harmony.',
    location: 'Copenhagen, Denmark',
    date: 'April 2026',
    camera: 'Sony A7R V',
    lens: 'FE 24-70mm f/2.8 GM II',
    aperture: 'f/8.0',
    shutterSpeed: '1/125s',
    iso: '100'
  },
  {
    id: 'photo-2',
    title: 'Golden Hour Solitude',
    category: 'Portrait',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200',
    description: 'Capturing a quiet and reflective human expression under high-contrast direct sunlight filtering through city dust and foliage.',
    location: 'New York, USA',
    date: 'June 2026',
    camera: 'Sony A7R V',
    lens: 'FE 85mm f/1.2 GM',
    aperture: 'f/1.4',
    shutterSpeed: '1/800s',
    iso: '100'
  },
  {
    id: 'photo-3',
    title: 'Misty Pine Ridge',
    category: 'Landscape',
    imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1200',
    description: 'Early morning mountain mist hanging low over a deep, dark evergreen forest valley, creating depth, mystery, and painterly layers.',
    location: 'Bavaria, Germany',
    date: 'October 2025',
    camera: 'Fujifilm GFX 100S',
    lens: 'GF 32-64mm f/4 R LM WR',
    aperture: 'f/11.0',
    shutterSpeed: '1/4s',
    iso: '100'
  },
  {
    id: 'photo-4',
    title: 'Midnight Shibuya',
    category: 'Street',
    imageUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=1200',
    description: 'Bright cyberpunk-themed neon reflections shimmering across wet asphalt during a torrential midnight rainstorm in Tokyo.',
    location: 'Tokyo, Japan',
    date: 'January 2026',
    camera: 'Sony A7R V',
    lens: 'FE 50mm f/1.2 GM',
    aperture: 'f/1.2',
    shutterSpeed: '1/100s',
    iso: '800'
  },
  {
    id: 'photo-5',
    title: 'Minimalist Pavilion',
    category: 'Architecture',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200',
    description: 'An elegant composition of negative space, linear geometry, and scale inside an open-air public pavilion with concrete overhangs.',
    location: 'Tokyo, Japan',
    date: 'January 2026',
    camera: 'Sony A7R V',
    lens: 'FE 35mm f/1.4 GM',
    aperture: 'f/4.0',
    shutterSpeed: '1/250s',
    iso: '64'
  },
  {
    id: 'photo-6',
    title: 'The Modern Classic',
    category: 'Portrait',
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1200',
    description: 'A textured high-contrast black and white studio portrait emphasizing strong bone structure, shadow fall-off, and micro-expressions.',
    location: 'Paris, France',
    date: 'March 2026',
    camera: 'Leica M11',
    lens: 'Summilux-M 50mm f/1.4',
    aperture: 'f/2.0',
    shutterSpeed: '1/160s',
    iso: '400'
  },
  {
    id: 'photo-7',
    title: 'Curves of Namibia',
    category: 'Landscape',
    imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1200',
    description: 'Searing wind-sculpted sand dunes showcasing infinite organic curves, striking ridges, and a sharp line dividing pure light and deep shadow.',
    location: 'Sossusvlei, Namibia',
    date: 'August 2025',
    camera: 'Fujifilm GFX 100S',
    lens: 'GF 110mm f/2 R LM WR',
    aperture: 'f/8.0',
    shutterSpeed: '1/500s',
    iso: '100'
  },
  {
    id: 'photo-8',
    title: 'Chasing Train Shadows',
    category: 'Street',
    imageUrl: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?q=80&w=1200',
    description: 'A high-contrast street moment capturing silhouetted commuters walking under the historic elevated train steel grids at sunrise.',
    location: 'Chicago, USA',
    date: 'September 2025',
    camera: 'Ricoh GR III',
    lens: '18.3mm f/2.8 (28mm Equiv.)',
    aperture: 'f/5.6',
    shutterSpeed: '1/400s',
    iso: '200'
  }
];

export const VIDEO_ITEMS: VideoItem[] = [
  {
    id: 'video-1',
    title: 'Forest Stream in Sunbeam',
    videoUrl: 'https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c022712505118a3efc211516fecf972b&profile_id=165&oauth2_token_id=57447761',
    thumbnailUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=600',
    duration: '0:30',
    description: 'A dreamy, slow-motion exploration of pure morning sunlight piercing through ancient forest canopies and bouncing off a flowing mountain creek.',
    location: 'Oregon, USA',
    category: 'Cinematography Reel',
    aspectRatio: '16:9'
  },
  {
    id: 'video-2',
    title: 'Urban Pulse & Neon Rhythm',
    videoUrl: 'https://player.vimeo.com/external/517602126.sd.mp4?s=d7e3da87224f8d975a6669931b6dfb2bf23e5a59&profile_id=165&oauth2_token_id=57447761',
    thumbnailUrl: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=600',
    duration: '0:24',
    description: 'Fast-paced, hyper-saturated urban cinematography exploring Tokyo at night, capturing train movements, dynamic reflections, and crowds.',
    location: 'Tokyo, Japan',
    category: 'Commercial Short',
    aspectRatio: '16:9'
  },
  {
    id: 'video-3',
    title: 'Minimalist Interior Stillness',
    videoUrl: 'https://player.vimeo.com/external/434045526.sd.mp4?s=c1e1933c08b61c8c683b745a3038843c0b13cf76&profile_id=165&oauth2_token_id=57447761',
    thumbnailUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600',
    duration: '0:15',
    description: 'An elegant, architectural ambient film focused on clean lines, light shadows moving across a minimalist indoor space, and peaceful symmetry.',
    location: 'Kyoto, Japan',
    category: 'Fine Art Short',
    aspectRatio: '16:9'
  }
];

import { AboutData } from './types';

export const DEFAULT_ABOUT_DATA: AboutData = {
  quote: '"I believe that empty spaces are never truly empty. They hold light, time, and silent resonance."',
  bioParagraph1: 'M. Bradescu is a Danish-born visual director and fine art photographer, focusing on brutalist architectural geometry, moody landscapes, and deep character portraits. Known for using minimal equipment and chasing natural ambient light, their work is curated globally for design publications and private galleries.',
  bioParagraph2: 'By bridging high-definition still frames with fluid, slow-paced cinematography, Bradescu’s mission is to document places and moments that allow the observer to slow down and breathe in a noisy world.',
  locationLabel: 'Bucharest, Romania',
  services: [
    {
      title: 'Architectural Documentation',
      desc: 'High-end visual capture of built environments, focusing on geometry, light shadows, and structural scales.'
    },
    {
      title: 'Editorial & Character Portraits',
      desc: 'Intimate, natural-light portraiture capturing deep, authentic expressions and human stories.'
    },
    {
      title: 'Cinematic Soundscapes & Video',
      desc: 'Directing atmospheric commercials, brand manifestos, property walkthroughs, and visual mood films.'
    }
  ],
  exhibitions: [
    { year: '2026', title: 'Urban Obscura Solo Show', venue: 'Tokyo House of Photography' },
    { year: '2025', title: 'Brutalist Echoes Group Exhibition', venue: 'Danish Design Center, Copenhagen' },
    { year: '2024', title: 'Misty Horizons: Landscapes', venue: 'Alpine Fine Art Gallery, Munich' }
  ]
};

