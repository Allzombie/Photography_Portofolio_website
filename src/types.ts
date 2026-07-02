export type Category = 'All' | 'Architecture' | 'Portrait' | 'Landscape' | 'Street';

export interface PhotoItem {
  id: string;
  title: string;
  category: Exclude<Category, 'All'>;
  imageUrl: string;
  description: string;
  location: string;
  date: string;
  camera: string;
  lens: string;
  aperture: string;
  shutterSpeed: string;
  iso: string;
}

export interface VideoItem {
  id: string;
  title: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: string;
  description: string;
  location: string;
  category: string;
  aspectRatio: '16:9' | '9:16';
}

export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
  service: string;
}

export interface InquiryItem extends ContactMessage {
  id: string;
  createdAt: string;
  status: 'unread' | 'read' | 'completed';
}

export interface ServiceItem {
  title: string;
  desc: string;
}

export interface ExhibitionItem {
  year: string;
  title: string;
  venue: string;
}

export interface AboutData {
  quote: string;
  bioParagraph1: string;
  bioParagraph2: string;
  locationLabel: string;
  services: ServiceItem[];
  exhibitions: ExhibitionItem[];
}
