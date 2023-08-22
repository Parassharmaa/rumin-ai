import { OpenAIStream, streamToResponse } from "ai";
import { type NextApiRequest, type NextApiResponse } from "next";
import OpenAI from "openai";
import {
  type CompletionCreateParamsStreaming,
  type ChatCompletionMessage,
  CreateChatCompletionRequestMessage,
} from "openai/resources/chat";
import {
  chartSystemPrompt,
  focusGroupParticipantSystemPrompt,
  focusGroupParticipantUserPrompt,
} from "~/utils/prompts";
import { truncateWrapper } from "openai-tokens";
import { ProjectType } from "@prisma/client";
import { prisma } from "~/server/db";
import { authOptions, getServerAuthSession } from "~/server/auth";
import { ChatCompletionAction } from "~/utils/interface";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { messages, action, ...body } = JSON.parse(req.body);

  const session = await getServerAuthSession({ req, res });

  if (!session) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  if (!action) {
    return res.status(400).json({
      error: "Missing action",
    });
  }

  if (action === ChatCompletionAction.ChartMessage) {
    const truncatedBody = truncateWrapper({
      model: "gpt-3.5-turbo",
      stream: true,
      opts: {
        limit: 1000,
      },
      messages: [chartSystemPrompt as ChatCompletionMessage, ...messages],
    }) as CompletionCreateParamsStreaming;

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

  if (action === ChatCompletionAction.GenerateFGParticipants) {
    const project = await prisma.project.findUnique({
      where: {
        id: body.projectId,
        userId: session?.user.id,
      },
    });

    if (!project) {
      throw new Error("Project not found");
    }
    if (project?.projectType !== ProjectType.FocusGroup) {
      throw new Error("Invalid project type");
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      stream: true,
      messages: [
        focusGroupParticipantSystemPrompt as ChatCompletionMessage,
        focusGroupParticipantUserPrompt(
          project.title,
          project?.description ?? "",
          messages[0].content
        ) as CreateChatCompletionRequestMessage,
      ],
      max_tokens: 2500,
      temperature: 0.9,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const stream = OpenAIStream(response, {
      onCompletion(completion) {
        console.log(completion);
      },
    });

    return streamToResponse(stream, res);
  }
}
