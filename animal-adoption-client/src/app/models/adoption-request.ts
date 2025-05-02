import { Animal } from "./animal";

export interface AdoptionRequest {
  _id: string;
  animalId: Animal;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  message: string;
  adoptionDate: Date;
  createdAt: Date;
  adReId: number;
}

export interface AdoptionRequestPopulated {
  _id: string;
  adReId: number;
  message: string;
  adoptionDate: Date;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  animalId: Animal;
  userId: {
    username: string;
    email: string;
  };
}