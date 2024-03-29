import { createTRPCRouter } from "@/server/api/trpc";
import { questionnaireRouter } from "@/server/api/routers/questionnaire";
import { authRouter } from "@/server/api/routers/auth";
import { submissionRouter } from "@/server/api/routers/submission";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  questionnaire: questionnaireRouter,
  auth: authRouter,
  submission: submissionRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
