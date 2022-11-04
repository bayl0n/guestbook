import { z } from "zod";

import { router, publicProcedure, protectedProcedure } from "../trpc";

export const postRouter = router({
    postMessage: protectedProcedure
        .input(
            z.object({
                name: z.string(),
                message: z.string()
            })
        )
        .mutation(async ({ ctx, input }) => {
            try {
                await ctx.prisma.post.create({
                    data: {
                        name: input.name,
                        message: input.message
                    },
                });
            } catch (error) {
                console.log(error);
            }
        }),
    getAll: publicProcedure.query(async ({ ctx }) => {
        return await ctx.prisma.post.findMany({
            select: {
                id: true,
                name: true,
                message: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }),
});