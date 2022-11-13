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
                user: z.object({
                    id: z.string(),
                }),
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
                        connect: input.user
                    }
                }
            });
        }),
    removeLike: protectedProcedure
        .input(
            z.object({
                postId: z.string(),
                userId: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            return await ctx.prisma.post.update({
                where: { id: input.postId },
                data: {
                    likes: {
                        disconnect: { id: input.userId },
                    }
                },
            })
        }),
    addReply: protectedProcedure
        .input(
            z.object({
                userId: z.string(),
                message: z.string(),
                replyId: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const newPost = await ctx.prisma.post.create({
                data: {
                    userId: input.userId,
                    message: input.message,
                }
            });

            return await ctx.prisma.post.update({
                where: { id: newPost.id },
                data: {
                    postId: input.replyId
                }
            });
        }),
});