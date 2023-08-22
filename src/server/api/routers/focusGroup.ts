import { ProjectType } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const focusGroupRouter = createTRPCRouter({
  addParticipant: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        participants: z.array(
          z.object({
            name: z.string().max(50),
            age: z.string().nonempty().max(5),
            gender: z.string().nonempty().max(10),
            background: z.string().nonempty().max(50),
            bio: z.string().max(500),
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

  allParticipants: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const participants = await ctx.prisma.focusGroupParticipants.findMany({
        where: {
          projectId: input.projectId,
        },
      });
      return participants;
    }),
});
