import { questionnaireRouter } from "@/server/api/routers/questionnaire";
import { createTRPCRouter } from "@/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  questionnaire: questionnaireRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
