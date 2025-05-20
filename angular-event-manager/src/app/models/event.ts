export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  organizer: string;
  category: string;
  maxParticipants: number;
  currentParticipants: number;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}
