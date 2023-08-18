import { OpenAIStream, streamToResponse } from "ai";
import { type NextApiRequest, type NextApiResponse } from "next";
import OpenAI from "openai";
import { type ChatCompletionMessage } from "openai/resources/chat";
import { chartSystemPrompt } from "~/utils/prompts";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { messages } = JSON.parse(req.body);

  const aiResponse = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    stream: true,
    messages: [chartSystemPrompt as ChatCompletionMessage, ...messages],
  });

  const stream = OpenAIStream(aiResponse);

  return streamToResponse(stream, res);
}
