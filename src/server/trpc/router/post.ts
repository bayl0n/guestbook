import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";

export const postRouter = router({
    getAll: publicProcedure
        .query(async ({ ctx }) => {
            return await ctx.prisma.post.findMany({
                select: {
                    id: true,
                    author: true,
                    message: true,
                    createdAt: true,
                    likes: true,
                    userId: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
            });
        }),
    postMessage: protectedProcedure
        .input(
            z.object({
                userId: z.string(),
                message: z.string()
            })
        )
        .mutation(async ({ ctx, input }) => {
            return await ctx.prisma.post.create({
                data: {
                    userId: input.userId,
                    message: input.message
                },
            });
        }),
    addLike: protectedProcedure
        .input(
            z.object({
                postId: z.string(),
                user: z.object({ id: z.string() })
            })
        )
        .mutation(async ({ ctx, input }) => {
            const res = await ctx.prisma.post.findUnique({
                where: { id: input.postId },
                select: {
                    likes: true,
                }
            });

            if (!res) return { error: "Could not find post" };

            await ctx.prisma.post.update({
                where: { id: input.postId },
                data: {
                    likes: {
                        set: [...res.likes, input.user],
                    }
                }
            });
        }),
});