export interface AIParticipant {
  id: string;
  name: string;
  age: string;
  gender: string;
  background: string;
  bio: string;
}

export type AIParticipantResponse = AIParticipant[];
