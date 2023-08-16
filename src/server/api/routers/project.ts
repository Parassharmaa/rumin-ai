import { ProjectType } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const projectRouter = createTRPCRouter({
  new: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        projectType: z.nativeEnum(ProjectType),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.create({
        data: {
          ...input,
          userId: ctx.session.user.id,
        },
      });

      return project;
    }),

  userProjects: protectedProcedure.query(async ({ ctx }) => {
    const projects = await ctx.prisma.project.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      // sort by newest first
      orderBy: {
        createdAt: "desc",
      },
    });

    return projects;
  }),
  userProjectById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input: { id } }) => {
      try {
        const project = await ctx.prisma.project.findFirstOrThrow({
          where: {
            id,
            userId: ctx.session.user.id,
          },
          include: {
            _count: {
              select: {
                FocusGroupParticipants: true,
              },
            },
          },
        });
        return project;
      } catch (error) {
        throw Error("Project not found");
      }
    }),
});
