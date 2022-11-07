import { z } from "zod";

import { router, publicProcedure, protectedProcedure } from "../trpc";

export const postRouter = router({
    postMessage: protectedProcedure
        .input(
            z.object({
                userId: z.string(),
                message: z.string()
            })
        )
        .mutation(async ({ ctx, input }) => {
            try {
                await ctx.prisma.post.create({
                    data: {
                        userId: input.userId,
                        message: input.message
                    },
                });
            } catch (error) {
                console.log(error);
            }
        }),
    getAll: publicProcedure
        .query(async ({ ctx }) => {
            return await ctx.prisma.post.findMany({
                select: {
                    id: true,
                    author: true,
                    message: true,
                    createdAt: true,
                    likes: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
            });
        }),
});