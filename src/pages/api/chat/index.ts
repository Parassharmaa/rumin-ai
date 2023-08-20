import { OpenAIStream, streamToResponse } from "ai";
import { type NextApiRequest, type NextApiResponse } from "next";
import OpenAI from "openai";
import {
  type CompletionCreateParamsStreaming,
  type ChatCompletionMessage,
} from "openai/resources/chat";
import { chartSystemPrompt } from "~/utils/prompts";
import { truncateWrapper } from "openai-tokens";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { messages } = JSON.parse(req.body);

  const truncatedBody = truncateWrapper({
    model: "gpt-3.5-turbo",
    stream: true,
    opts: {
      limit: 1000,
    },
    messages: [chartSystemPrompt as ChatCompletionMessage, ...messages],
  }) as CompletionCreateParamsStreaming;

  console.log(truncatedBody);

  const aiResponse = await openai.chat.completions.create({
    ...truncatedBody,
    temperature: 0.8,
  });

  const stream = OpenAIStream(aiResponse, {
    onCompletion(completion) {
      console.log(completion);
    },
  });

  return streamToResponse(stream, res);
}
