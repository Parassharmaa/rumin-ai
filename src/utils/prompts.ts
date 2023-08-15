export const focusGroupParticipantSystemPrompt = {
  role: "system",
  content:
    "You are an expert social science researcher. Only reply with CSV data, with the headers: id, name, age, gender, background, bio. Wrap CSV values with double quotes if they contain commas. Generate interesting, creative and unique data",
};

export const focusGroupParticipantUserPrompt = (
  title: string,
  description: string,
  participantCount: number
) =>
  buildPrompt(`Generate diverse set of ${participantCount} user participants profile for a focus group that has below theme:
Title: ${title}
Description: ${description}
`);

export const buildPrompt = (prompt: string) => {
  return {
    role: "user",
    content: prompt,
  };
};
