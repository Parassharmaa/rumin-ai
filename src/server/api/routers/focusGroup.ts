import { ProjectType } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

import {
  type ChatCompletionRequestMessage,
  Configuration,
  OpenAIApi,
} from "openai";
import {
  focusGroupParticipantSystemPrompt,
  focusGroupParticipantUserPrompt,
} from "~/utils/prompts";
import { parseCsvToJson } from "~/utils/parser";
import { type AIParticipantResponse } from "~/utils/interface";

export const runtime = "edge";

const apiConfig = new Configuration({
  apiKey: process.env.OPENAI_API_KEY!,
});

const openai = new OpenAIApi(apiConfig);

export const focusGroupRouter = createTRPCRouter({
  generateParticipants: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        participantCount: z.number().default(5),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findUnique({
        where: {
          id: input.projectId,
          userId: ctx.session.user.id,
        },
      });

      if (!project) {
        throw new Error("Project not found");
      }
      if (project?.projectType !== ProjectType.FocusGroup) {
        throw new Error("Invalid project type");
      }

      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        stream: false,
        messages: [
          focusGroupParticipantSystemPrompt as ChatCompletionRequestMessage,
          focusGroupParticipantUserPrompt(
            project.title,
            project?.description ?? "",
            input.participantCount
          ) as ChatCompletionRequestMessage,
        ],
        max_tokens: 2500,
        temperature: 0.9,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      const message = response.data.choices?.[0]?.message;

      if (!message) {
        throw new Error("Invalid response");
      }

      return parseCsvToJson(message.content) as AIParticipantResponse;
    }),

  addParticipant: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        participants: z.array(
          z.object({
            name: z.string(),
            age: z.string(),
            gender: z.string(),
            background: z.string(),
            bio: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findUnique({
        where: {
          id: input.projectId,
          userId: ctx.session.user.id,
        },
      });

      if (!project) {
        throw new Error("Project not found");
      }

      if (project?.projectType !== ProjectType.FocusGroup) {
        throw new Error("Invalid project type");
      }

      const participants = await ctx.prisma.focusGroupParticipants.createMany({
        data: input.participants.map((participant) => ({
          projectId: input.projectId,
          name: participant.name,
          age: participant.age,
          gender: participant.gender,
          background: participant.background,
          bio: participant.bio,
        })),
      });

      return participants;
    }),
});
