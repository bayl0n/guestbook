import { HeartIcon as SolidHeartIcon } from "@heroicons/react/24/solid";
import { HeartIcon as OutlineHeartIcon } from "@heroicons/react/24/outline";

import type { Post, User } from "@prisma/client";
import type { Session } from "next-auth/core/types";
import { trpc } from "../../../utils/trpc";
import { useState } from "react";

interface Props {
    session: Session | null;
    post: Post;
    author: User;
    likes: User[];
}

export default function MessageItem({ session, post, author, likes }: Props) {

    const addLike = trpc.post.addLike.useMutation()
    const removeLike = trpc.post.removeLike.useMutation()

    const [liked, setLiked] = useState<boolean>(likes.find(user => {
        return (user.name == session?.user?.name);
    }) ? true : false);

    const [likeCount, setLikeCount] = useState<number>(likes.length)

    return (
        <div className="flex flex-col gap-2 justify-center text-center mx-auto w-11/12 md:w-1/2 border-2 rounded-md border-neutral-800 p-4">
            <p className="text-neutral-400">
                &quot;{post.message}&quot;
            </p>
            <span className="italic font-bold">- {author.name}</span>
            <span className="text-neutral-500 italic text-sm">{post.createdAt?.toLocaleString('en-US', { dateStyle: "long" })} at {post.createdAt.toLocaleTimeString('en-US')}</span>
            <div className="flex gap-2 justify-center">
                {
                    liked ?
                        <button onClick={() => {
                            if (!session?.user) return;

                            removeLike.mutate({
                                postId: post.id,
                                userId: session.user.id
                            })
                            setLiked(false)
                            setLikeCount(likeCount - 1)
                        }}>
                            <SolidHeartIcon className="w-4 h-4 " />
                        </button>
                        :
                        <button onClick={() => {
                            if (!session?.user) return;
                            addLike.mutate({
                                postId: post.id,
                                user: { id: session.user.id }
                            })

                            setLiked(true)
                            setLikeCount(likeCount + 1)
                        }}>
                            <OutlineHeartIcon className="w-4 h-4 " />
                        </button>
                }
                <div>
                    {likeCount}
                </div>
            </div>
        </div>
    )
}