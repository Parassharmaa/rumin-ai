export const focusGroupParticipantSystemPrompt = {
  role: "system",
  content:
    "You are an expert social science researcher. Only reply with CSV data, with the headers: id, name, age, gender, background, bio.",
};

export const focusGroupParticipantUserPrompt = (
  title: string,
  description: string,
  participantCount: number
) =>
  buildPrompt(`Generate ${participantCount} user participants profile for a group session with the below theme:
Title: ${title}
Description: ${description}
`);

export const buildPrompt = (prompt: string) => {
  return {
    role: "user",
    content: prompt,
  };
};
