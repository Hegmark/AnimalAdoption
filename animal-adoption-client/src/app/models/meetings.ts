import { Animal } from './animal';

export interface Meeting {
  animalId: Animal;
  date: string;
}

export interface AdminMeeting {
  username:   string;
  animalName: string;
  date:       string;
}