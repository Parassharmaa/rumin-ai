export interface AIParticipant {
  id?: string;
  name?: string;
  age?: string;
  gender?: string;
  background?: string;
  bio?: string;
}

export enum ChatCompletionAction {
  ChartMessage = "chart_message",
  GenerateFGParticipants = "generate_fg_participants",
}

export type AIParticipantResponse = AIParticipant[];
