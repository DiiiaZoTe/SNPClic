import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { logError } from "@/lib/utilities/logger";
import { deleteSubmissionById } from "@/server/db/queries/submission";

export const submissionRouter = createTRPCRouter({
  deleteSubmissionById: protectedProcedure
    .input(z.object({
      submissionId: z.string().min(1, "Veuillez fournir un identifiant de soumission valide."),
    }))
    .mutation(async ({ ctx, input }) => {
      const { submissionId } = input;
      const { user } = ctx;
      try {
        await deleteSubmissionById({
          submissionId,
          user: user,
        });
      } catch (error) {
        logError({
          location: "/api/trpc/submission.deleteSubmissionById",
          error: error
        })
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Une erreur s'est produite lors de la suppression de la soumission.",
          cause: submissionId
        });
      }
      return {
        success: true,
        submissionId
      };
    }),

});