import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const exampleRouter = router({
  hello: publicProcedure
    .input(z.object({ text: z.string().nullish() }).nullish())
    .query(({ input }) => {
      return {
        greeting: `Hello ${input?.text ?? "world"}`,
      };
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),
  firstQuery: publicProcedure.input(z.object({ text: z.string().nullish() }).nullish())
    .query(({ input }) => {
      return {
        message: `This is a message from ${input?.text ?? "no one"}`,
      };
    }),
});
