import { Animal } from "./animal";

export interface AdoptionRequest {
  _id: string;
  animalId: Animal;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  message: string;
  meetingDate: Date;
  createdAt: Date;
  adReId: number;
}
