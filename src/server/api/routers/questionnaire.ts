import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { forms } from "@/server/db/schema";
import { sql } from "drizzle-orm";
import { Form } from "@/app/questionnaire/types";

export const questionnaireRouter = createTRPCRouter({
  getDefaultForm: publicProcedure
    .query(async ({ ctx }) => {
      const form = await ctx.db.select({config: forms.config}).from(forms).where(sql`${forms.id} = 1`);
      if(!form[0]?.config) throw new Error("No form found");
      return {
        form: form[0]?.config as Form,
      };
    }),

  //* mutation + protected procedure example
  // create: protectedProcedure
  //   .input(z.object({ name: z.string().min(1) }))
  //   .mutation(async ({ ctx, input }) => {
  //     // simulate a slow db call
  //     await new Promise((resolve) => setTimeout(resolve, 1000));

  //     await ctx.db.insert().values({});
  //   }),
});
