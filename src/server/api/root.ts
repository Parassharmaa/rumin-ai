import { projectRouter } from "~/server/api/routers/project";
import { createTRPCRouter } from "~/server/api/trpc";
import { focusGroupRouter } from "./routers/focusGroup";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  project: projectRouter,
  focusGroup: focusGroupRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
